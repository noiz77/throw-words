/**
 * Throw Words - Background Service Worker
 * 处理与 Google Apps Script 的通信
 */

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveWord') {
    handleSaveWord(request.word)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({
        success: false,
        message: error.message
      }));
    return true; // 保持消息通道开放以支持异步响应
  }

  if (request.action === 'testConnection') {
    handleTestConnection()
      .then(result => sendResponse(result))
      .catch(error => sendResponse({
        success: false,
        message: error.message
      }));
    return true;
  }

  if (request.action === 'exportWords') {
    handleExportWords()
      .then(result => sendResponse(result))
      .catch(error => sendResponse({
        success: false,
        message: error.message
      }));
    return true;
  }
});

/**
 * 保存单词到 Google Sheet
 */
async function handleSaveWord(word) {
  const settings = await chrome.storage.sync.get(['webAppUrl']);

  if (!settings.webAppUrl) {
    return {
      success: false,
      message: '请先在插件设置中配置 Google Apps Script URL'
    };
  }

  try {
    const response = await fetch(settings.webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word: word }),
      redirect: 'follow' // Google Apps Script 会先重定向
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Throw Words: 保存失败', error);
    return {
      success: false,
      message: '网络请求失败，请检查网络连接或 URL 配置'
    };
  }
}

/**
 * 测试与 Google Apps Script 的连接
 */
async function handleTestConnection() {
  const settings = await chrome.storage.sync.get(['webAppUrl']);

  if (!settings.webAppUrl) {
    return {
      success: false,
      message: '请先配置 Web App URL'
    };
  }

  try {
    const response = await fetch(settings.webAppUrl, {
      method: 'GET',
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Throw Words: 连接测试失败', error);
    return {
      success: false,
      message: '连接失败: ' + error.message
    };
  }
}

/**
 * 导出生词本单词
 */
async function handleExportWords() {
  const settings = await chrome.storage.sync.get(['webAppUrl']);

  if (!settings.webAppUrl) {
    return {
      success: false,
      message: '请先配置 Web App URL'
    };
  }

  try {
    const exportUrl = settings.webAppUrl + '?action=export';
    const response = await fetch(exportUrl, {
      method: 'GET',
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Throw Words: 导出失败', error);
    return {
      success: false,
      message: '导出失败: ' + error.message
    };
  }
}
