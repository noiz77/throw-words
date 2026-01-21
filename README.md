# Throw Words 生词投掷器 📚

一个简洁的 Chrome 浏览器插件，帮助你在浏览英文网页时快速收集生词到 Google Sheet。

![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat&logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ 功能特色

- 🖱️ **划词即存**：选中任意英文单词，一键保存到 Google Sheet
- 🚫 **自动去重**：智能检测重复单词，避免重复添加
- 📊 **熟悉程度**：支持「陌生/模糊/熟悉」三级分类管理
- ⏰ **时间记录**：自动记录添加时间，方便回顾学习进度
- 🎨 **优雅交互**：精美的悬浮按钮，流畅的动画效果

---

## 📦 安装步骤

### 1. 准备 Google Sheet

按照 `google-apps-script/DEPLOY_GUIDE.md` 中的步骤：
1. 创建一个新的 Google Sheet
2. 部署 Google Apps Script
3. 获取 Web App URL

### 2. 安装 Chrome 插件

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 开启右上角的 **「开发者模式」**
3. 点击 **「加载已解压的扩展程序」**
4. 选择 `throw-words` 文件夹
5. 插件安装完成！

### 3. 配置插件

1. 点击浏览器工具栏的 📚 图标
2. 粘贴你的 Google Apps Script Web App URL
3. 点击「保存设置」
4. 点击「测试连接」确保连接成功

---

## 🚀 使用方法

1. **浏览网页**：打开任意包含英文的网页
2. **划选单词**：用鼠标选中你不认识的英文单词
3. **点击保存**：点击出现的 📚 悬浮按钮
4. **完成！** 单词已自动保存到你的 Google Sheet

---

## 📁 项目结构

```
throw-words/
├── manifest.json          # 插件配置文件
├── background.js          # 后台服务脚本
├── content.js             # 内容脚本（划词功能）
├── content.css            # 悬浮按钮样式
├── popup/                 # 设置弹窗
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── icons/                 # 插件图标
│   └── icon.svg
└── google-apps-script/    # Google Apps Script 相关
    ├── Code.gs            # Apps Script 代码
    └── DEPLOY_GUIDE.md    # 部署指南
```

---

## 🎯 与 AI 学习工具配合使用

收集的生词可以导出并与各种 AI 学习工具配合使用：

### Gemini Canvas
将 Google Sheet 分享给 Gemini，让它帮你：
- 生成单词释义和例句
- 创建记忆卡片
- 设计复习测验

### 其他用途
- 导出 CSV 用于 Anki 制作闪卡
- 配合 ChatGPT 生成学习计划
- 使用其他语言学习 App 导入

---

## ⚙️ Google Sheet 数据格式

| 单词 | 熟悉程度 | 添加时间 |
|------|----------|----------|
| ephemeral | 陌生 | 2024-01-20 12:30:00 |
| ubiquitous | 模糊 | 2024-01-20 12:35:00 |
| eloquent | 熟悉 | 2024-01-20 12:40:00 |

**熟悉程度说明**：
- `陌生`：完全不认识的新单词（默认）
- `模糊`：有印象但不确定含义
- `熟悉`：已掌握的单词

---

## 🔧 常见问题

### Q: 为什么点击按钮没反应？
A: 请检查是否已配置 Web App URL，可在插件设置中测试连接。

### Q: 单词保存后在 Sheet 中看不到？
A: 请确保 Apps Script 已正确授权，并且 Sheet 有写入权限。

### Q: 能否保存中文/其他语言？
A: 目前仅支持英文单词，后续版本可能会支持更多语言。

---

## 📄 License

MIT License - 自由使用和修改

---

Made with ❤️ for English learners
