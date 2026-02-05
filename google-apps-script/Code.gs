/**
 * Throw Words - Google Apps Script
 * 用于接收 Chrome 插件发送的单词数据并存储到 Google Sheet
 */

// 设置允许跨域请求
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const word = data.word ? data.word.trim().toLowerCase() : '';
    
    if (!word) {
      return createResponse({ success: false, message: '单词不能为空' });
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 检查是否已存在该单词（防止重复）
    const existingWords = sheet.getRange('A:A').getValues();
    for (let i = 1; i < existingWords.length; i++) { // 从第2行开始，跳过表头
      if (existingWords[i][0] && existingWords[i][0].toString().toLowerCase() === word) {
        return createResponse({ 
          success: false, 
          message: '单词已存在',
          duplicate: true 
        });
      }
    }
    
    // 添加新单词
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Shanghai', 'yyyy-MM-dd HH:mm:ss');
    const level = '陌生'; // 默认熟悉程度
    
    sheet.appendRow([word, level, timestamp]);
    
    return createResponse({ 
      success: true, 
      message: '单词已添加',
      word: word 
    });
    
  } catch (error) {
    return createResponse({ 
      success: false, 
      message: '服务器错误: ' + error.toString() 
    });
  }
}

// 处理 GET 请求（用于测试连接或导出单词）
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetUrl = sheet.getUrl();
  
  // 检查是否为导出请求
  const action = e.parameter.action;
  if (action === 'export') {
    return handleExportWords();
  }
  
  return createResponse({ 
    success: true, 
    message: 'Throw Words API 运行正常',
    version: '1.0.0',
    sheetUrl: sheetUrl
  });
}

// 导出所有单词（按字母顺序排序）
function handleExportWords() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getRange('A:A').getValues();
    
    // 提取单词（跳过表头，过滤空值）
    const words = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().trim() !== '') {
        words.push(data[i][0].toString().trim().toLowerCase());
      }
    }
    
    // 按字母顺序排序
    words.sort((a, b) => a.localeCompare(b));
    
    return createResponse({
      success: true,
      words: words,
      count: words.length
    });
  } catch (error) {
    return createResponse({
      success: false,
      message: '导出失败: ' + error.toString()
    });
  }
}

// 创建 CORS 响应
function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// 初始化表格（首次运行时调用）
function initSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 检查是否已有表头
  const firstRow = sheet.getRange('A1:C1').getValues()[0];
  if (firstRow[0] === '单词' && firstRow[1] === '熟悉程度' && firstRow[2] === '添加时间') {
    Logger.log('表格已初始化');
    return;
  }
  
  // 设置表头
  sheet.getRange('A1:C1').setValues([['单词', '熟悉程度', '添加时间']]);
  
  // 设置表头样式
  const headerRange = sheet.getRange('A1:C1');
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  
  // 设置列宽
  sheet.setColumnWidth(1, 200); // 单词
  sheet.setColumnWidth(2, 100); // 熟悉程度
  sheet.setColumnWidth(3, 180); // 添加时间
  
  // 提示：如需下拉菜单，请在 Sheet 中手动设置：
  // 选中 B 列 → 数据 → 数据验证 → 添加条件 → 下拉菜单 → 输入"陌生,模糊,熟悉"
  
  Logger.log('表格初始化完成');
}
