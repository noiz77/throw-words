/**
 * Throw Words - Popup Script
 * 设置弹窗逻辑
 */

document.addEventListener('DOMContentLoaded', () => {
    // 元素引用
    const urlInput = document.getElementById('webAppUrl');
    const saveBtn = document.getElementById('saveBtn');
    const testBtn = document.getElementById('testBtn');
    const guideLink = document.getElementById('guideLink');
    const statusCard = document.getElementById('statusCard');
    const statusIcon = document.getElementById('statusIcon');
    const statusLabel = document.getElementById('statusLabel');
    const statusDesc = document.getElementById('statusDesc');
    const openSheetBtn = document.getElementById('openSheetBtn');
    const exportBtn = document.getElementById('exportBtn');
    const sheetActions = document.getElementById('sheetActions');

    // 加载已保存的设置
    loadSettings();

    // 保存设置
    saveBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();

        if (!url) {
            shakeInput(urlInput);
            updateStatus('error', '❌', '请输入 URL', '不能为空');
            return;
        }

        if (!isValidUrl(url)) {
            shakeInput(urlInput);
            updateStatus('error', '❌', 'URL 格式错误', '请检查 URL 格式');
            return;
        }

        // 保存到 storage
        await chrome.storage.sync.set({ webAppUrl: url });

        updateStatus('connected', '✅', '设置已保存', '正在验证连接...');

        // 自动测试连接
        testConnection();
    });

    // 测试连接
    testBtn.addEventListener('click', testConnection);

    // 打开部署指南
    guideLink.addEventListener('click', (e) => {
        e.preventDefault();
        // 打开项目中的部署指南（如果在本地）或显示提示
        chrome.tabs.create({
            url: 'https://github.com/noiz77/throw-words/blob/main/google-apps-script/DEPLOY_GUIDE.md'
        });
    });

    // 打开生词本
    openSheetBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const settings = await chrome.storage.sync.get(['sheetUrl']);
        if (settings.sheetUrl) {
            chrome.tabs.create({ url: settings.sheetUrl });
        }
    });

    // 导出生词本
    exportBtn.addEventListener('click', async () => {
        await exportWords();
    });

    /**
     * 加载设置
     */
    async function loadSettings() {
        const settings = await chrome.storage.sync.get(['webAppUrl', 'sheetUrl']);

        if (settings.webAppUrl) {
            urlInput.value = settings.webAppUrl;
            testConnection();
        } else {
            updateStatus('disconnected', '📋', '未配置', '请在下方输入 Web App URL');
        }

        // 显示/隐藏操作按钮区域
        if (settings.sheetUrl) {
            sheetActions.style.display = 'flex';
        }
    }

    /**
     * 测试连接
     */
    async function testConnection() {
        const url = urlInput.value.trim();

        if (!url) {
            updateStatus('disconnected', '📋', '未配置', '请输入 Web App URL');
            return;
        }

        updateStatus('checking', '⏳', '测试中...', '正在连接服务器');
        testBtn.disabled = true;
        saveBtn.disabled = true;

        try {
            const response = await chrome.runtime.sendMessage({ action: 'testConnection' });

            if (response.success) {
                updateStatus('connected', '✅', '连接成功', `版本: ${response.version || 'N/A'}`);

                // 保存并显示 Sheet URL
                if (response.sheetUrl) {
                    await chrome.storage.sync.set({ sheetUrl: response.sheetUrl });
                    sheetActions.style.display = 'flex';
                }
            } else {
                updateStatus('disconnected', '❌', '连接失败', response.message || '请检查 URL');
                sheetActions.style.display = 'none';
            }
        } catch (error) {
            updateStatus('disconnected', '❌', '连接错误', error.message);
            sheetActions.style.display = 'none';
        } finally {
            testBtn.disabled = false;
            saveBtn.disabled = false;
        }
    }

    /**
     * 更新状态显示
     */
    function updateStatus(type, icon, label, desc) {
        statusCard.className = 'status-card ' + type;
        statusIcon.textContent = icon;
        statusLabel.textContent = label;
        statusDesc.textContent = desc;
    }

    /**
     * 验证 URL 格式
     */
    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'https:' && string.includes('script.google.com');
        } catch (_) {
            return false;
        }
    }

    /**
     * 抖动输入框
     */
    function shakeInput(element) {
        element.classList.add('shake');
        setTimeout(() => element.classList.remove('shake'), 300);
    }

    /**
     * 导出生词本到 txt 文件
     */
    async function exportWords() {
        exportBtn.disabled = true;
        const originalText = exportBtn.querySelector('.link-text').textContent;
        exportBtn.querySelector('.link-text').textContent = '导出中...';

        try {
            const response = await chrome.runtime.sendMessage({ action: 'exportWords' });

            if (response.success && response.words) {
                if (response.words.length === 0) {
                    alert('生词本为空，没有可导出的单词');
                    return;
                }

                // 用换行连接单词
                const content = response.words.join('\n');

                // 创建并下载文件
                downloadFile(content, 'vocabulary.txt', 'text/plain');

                exportBtn.querySelector('.link-text').textContent = '导出成功!';
                setTimeout(() => {
                    exportBtn.querySelector('.link-text').textContent = originalText;
                }, 2000);
            } else {
                alert('导出失败: ' + (response.message || '未知错误'));
                exportBtn.querySelector('.link-text').textContent = originalText;
            }
        } catch (error) {
            alert('导出出错: ' + error.message);
            exportBtn.querySelector('.link-text').textContent = originalText;
        } finally {
            exportBtn.disabled = false;
        }
    }

    /**
     * 下载文件
     */
    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});
