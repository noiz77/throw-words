# Google Apps Script 部署指南

## 📋 步骤概览

1. 创建 Google Sheet
2. 打开 Apps Script 编辑器
3. 粘贴代码并初始化
4. 部署为 Web App
5. 复制 URL 到插件设置

---

## 🚀 详细步骤

### 步骤 1：创建 Google Sheet

1. 打开 [Google Sheets](https://sheets.google.com)
2. 点击 **"空白"** 创建新表格
3. 将表格命名为 **"Throw Words 生词本"**（或你喜欢的名字）

### 步骤 2：打开 Apps Script 编辑器

1. 在 Google Sheet 中，点击菜单栏的 **"扩展程序"** → **"Apps Script"**
2. 这会打开一个新的 Apps Script 编辑器页面

### 步骤 3：粘贴代码

1. 删除编辑器中默认的所有代码
2. 将 `Code.gs` 文件中的完整代码复制粘贴进去
3. 按 `Ctrl+S`（Mac: `Cmd+S`）保存
4. 将项目命名为 **"Throw Words API"**

### 步骤 4：初始化表格

1. 在 Apps Script 编辑器中，找到函数下拉菜单（顶部工具栏）
2. 选择 **`initSheet`** 函数
3. 点击 **"运行"** 按钮 ▶️
4. 首次运行会要求授权，点击 **"查看权限"** → 选择你的 Google 账号 → **"允许"**
5. 运行成功后，回到 Google Sheet 查看，应该能看到表头已创建

### 步骤 5：部署为 Web App

1. 在 Apps Script 编辑器中，点击右上角的 **"部署"** → **"新建部署"**
2. 点击左侧的 **"选择类型"** ⚙️ 图标 → 选择 **"Web 应用"**
3. 填写配置：
   - **说明**：`Throw Words API v1.0`
   - **执行身份**：选择 **"我"**（你的账号）
   - **谁有权访问**：选择 **"任何人"**
4. 点击 **"部署"**
5. 首次部署会再次要求授权，按提示完成授权
6. **复制生成的 Web App URL**（类似：`https://script.google.com/macros/s/xxx.../exec`）

### 步骤 6：配置 Chrome 插件

1. 安装 Throw Words 插件
2. 点击插件图标 → 设置
3. 将复制的 Web App URL 粘贴到设置中
4. 保存

---

## ✅ 测试连接

在浏览器中直接访问你的 Web App URL，如果看到类似以下内容，说明部署成功：

```json
{"success":true,"message":"Throw Words API 运行正常","version":"1.0.0"}
```

---

## ⚠️ 常见问题

### Q: 授权时提示"此应用未经验证"
**A**: 这是正常的，因为这是你自己创建的脚本。点击 **"高级"** → **"转至 Throw Words API（不安全）"** → **"允许"**

### Q: 更新代码后需要重新部署吗？
**A**: 是的。修改代码后需要：**部署** → **管理部署** → **编辑** → 选择新版本 → **部署**

### Q: 如何查看日志？
**A**: 在 Apps Script 编辑器中，点击 **"执行"** 菜单可以查看执行日志
