/**
 * Throw Words - Content Script
 * 划词检测 + 悬浮按钮
 */

(function () {
    'use strict';

    // 悬浮按钮元素
    let floatingButton = null;
    // 当前选中的单词
    let selectedWord = '';
    // 防止重复创建
    let isButtonVisible = false;

    /**
     * 创建悬浮按钮
     */
    function createFloatingButton() {
        if (floatingButton) return floatingButton;

        floatingButton = document.createElement('div');
        floatingButton.id = 'throw-words-btn';
        floatingButton.innerHTML = '📚';
        floatingButton.title = '添加到生词本';

        // 点击事件
        floatingButton.addEventListener('click', handleButtonClick);

        // 阻止事件冒泡
        floatingButton.addEventListener('mousedown', (e) => e.stopPropagation());
        floatingButton.addEventListener('mouseup', (e) => e.stopPropagation());

        document.body.appendChild(floatingButton);
        return floatingButton;
    }

    /**
     * 显示悬浮按钮
     */
    function showButton(x, y) {
        if (!floatingButton) createFloatingButton();

        // 计算位置，确保不超出视口
        const buttonSize = 36;
        const padding = 10;

        let left = x + padding;
        let top = y - buttonSize - padding;

        // 边界检测
        if (left + buttonSize > window.innerWidth) {
            left = x - buttonSize - padding;
        }
        if (top < 0) {
            top = y + padding;
        }

        floatingButton.style.left = `${left}px`;
        floatingButton.style.top = `${top}px`;
        floatingButton.classList.add('visible');
        floatingButton.classList.remove('success', 'error', 'loading');
        floatingButton.innerHTML = '📚';
        isButtonVisible = true;
    }

    /**
     * 隐藏悬浮按钮
     */
    function hideButton() {
        if (floatingButton) {
            floatingButton.classList.remove('visible');
            isButtonVisible = false;
        }
    }

    /**
     * 检查是否为有效的英文单词
     */
    function isValidEnglishWord(text) {
        if (!text) return false;

        // 去除首尾空格
        const word = text.trim();

        // 检查长度（1-45个字符，最长的英文单词约45个字母）
        if (word.length < 1 || word.length > 45) return false;

        // 只包含英文字母（允许连字符，如 "self-esteem"）
        const englishWordPattern = /^[a-zA-Z]+(-[a-zA-Z]+)*$/;
        return englishWordPattern.test(word);
    }

    /**
     * 处理文本选择事件
     */
    function handleSelection(e) {
        // 延迟执行，等待选择完成
        setTimeout(() => {
            const selection = window.getSelection();
            const text = selection.toString().trim();

            if (isValidEnglishWord(text)) {
                selectedWord = text.toLowerCase();

                // 获取选区位置
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                // 在选区右上角显示按钮
                const x = rect.right + window.scrollX;
                const y = rect.top + window.scrollY;

                showButton(x, y);
            } else {
                hideButton();
                selectedWord = '';
            }
        }, 10);
    }

    /**
     * 处理按钮点击
     */
    async function handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!selectedWord) return;

        // 显示加载状态
        floatingButton.classList.add('loading');
        floatingButton.innerHTML = '⏳';

        try {
            const response = await chrome.runtime.sendMessage({
                action: 'saveWord',
                word: selectedWord
            });

            floatingButton.classList.remove('loading');

            if (response.success) {
                // 成功
                floatingButton.classList.add('success');
                floatingButton.innerHTML = '✅';
                showToast(`"${selectedWord}" 已添加到生词本`, 'success');
            } else if (response.duplicate) {
                // 重复
                floatingButton.classList.add('error');
                floatingButton.innerHTML = '🔄';
                showToast(`"${selectedWord}" 已在生词本中`, 'warning');
            } else {
                // 失败
                floatingButton.classList.add('error');
                floatingButton.innerHTML = '❌';
                showToast(response.message || '添加失败', 'error');
            }

            // 2秒后隐藏
            setTimeout(() => {
                hideButton();
                window.getSelection().removeAllRanges();
            }, 1500);

        } catch (error) {
            console.error('Throw Words: 发送失败', error);
            floatingButton.classList.remove('loading');
            floatingButton.classList.add('error');
            floatingButton.innerHTML = '❌';
            showToast('发送失败，请检查插件设置', 'error');
        }
    }

    /**
     * 显示 Toast 提示
     */
    function showToast(message, type = 'info') {
        // 移除已存在的 toast
        const existingToast = document.getElementById('throw-words-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.id = 'throw-words-toast';
        toast.className = `throw-words-toast ${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // 触发动画
        requestAnimationFrame(() => {
            toast.classList.add('visible');
        });

        // 3秒后移除
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * 处理点击事件（用于隐藏按钮）
     */
    function handleDocumentClick(e) {
        // 如果点击的不是悬浮按钮，且按钮可见，则隐藏
        if (floatingButton && isButtonVisible && !floatingButton.contains(e.target)) {
            // 检查是否有新的选择
            const selection = window.getSelection();
            const text = selection.toString().trim();

            if (!isValidEnglishWord(text)) {
                hideButton();
                selectedWord = '';
            }
        }
    }

    // 初始化
    function init() {
        // 创建悬浮按钮
        createFloatingButton();

        // 监听鼠标抬起事件（选择完成）
        document.addEventListener('mouseup', handleSelection);

        // 监听点击事件（隐藏按钮）
        document.addEventListener('click', handleDocumentClick);

        // 监听键盘事件（Escape 隐藏按钮）
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideButton();
                selectedWord = '';
            }
        });

        console.log('Throw Words: 插件已加载 📚');
    }

    // 确保 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
