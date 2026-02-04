# 🧨 AI 春节年兽故事生成器

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://www.w3.org/html/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

🎆 用 AI 创作属于你的春节年兽传说

[在线演示](#) | [功能特性](#功能特性) | [快速开始](#快速开始)

</div>

---

## 📖 项目简介

**AI 春节年兽故事生成器**是一个基于 Web 的春节主题互动应用，结合传统节日文化与现代 AI 技术，提供年兽故事创作、春节习俗查询等功能。

### ✨ 核心特色

- 🎨 **AI 驱动**：集成 OpenAI API，智能生成个性化年兽故事
- 🏮 **传统文化**：融入春节对联、倒计时、习俗查询等传统元素
- 🎮 **成就系统**：11个趣味成就，记录你的创作历程
- 🎆 **视觉特效**：烟花粒子特效，营造节日氛围
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🔒 **数据持久化**：localStorage 本地存储，保护用户隐私

---

## 🚀 功能特性

### 📖 故事生成器

- **5种故事风格**：
  - 🏛️ 传统神话风格
  - 😄 幽默搞笑风格
  - 🗺️ 冒险探险风格
  - 💖 温馨治愈风格
  - 🔍 悬疑解谜风格

- **4个年龄范围**：
  - 3-6岁（幼儿）
  - 7-12岁（儿童）
  - 13-18岁（青少年）
  - 成人（18岁以上）

- **智能提示**：
  - 实时字符计数（最大500字符）
  - 提示词限制，确保故事围绕年兽主题
  - 成就自动解锁通知

### 🎋 习俗查询

- 覆盖全国 20 个省份/直辖市
- AI 智能生成，确保信息真实准确
- 全屏加载动画，提升用户体验
- 防虚假信息机制，禁止编造习俗

### 🎆 视觉体验

- **烟花特效**：动态烟花背景，节日氛围浓厚
- **粒子系统**：悬浮粒子，增加视觉层次
- **春节对联**：AI 生成 + 本地降级，自动刷新
- **倒计时**：实时显示距离春节的时间
- **流畅动画**：精心设计的过渡效果

### 🏆 成就系统

11个趣味成就等你解锁：

| 成就 | 描述 | 图标 |
|------|------|------|
| 初试年兽 | 创作第一个年兽故事 | 🎉 |
| 多产作家 | 创作10个故事 | 📚 |
| 风格大师 | 尝试所有5种风格 | 🎨 |
| 全年龄段 | 体验所有4个年龄范围 | 👥 |
| 传统守护者 | 创作5个传统风格故事 | 🏛️ |
| 幽默大师 | 创作5个幽默风格故事 | 😄 |
| 冒险家 | 创作5个冒险风格故事 | 🗺️ |
| 治愈者 | 创作5个温馨风格故事 | 💖 |
| 侦探 | 创作5个悬疑风格故事 | 🔍 |
| 深度探索者 | 创作总字数超过5000字 | ✍️ |
| 故事收藏家 | 收集20个故事 | 📖

---

## 🛠️ 技术栈

### 前端技术

- **HTML5**：语义化标签，结构清晰
- **CSS3**：
  - Flexbox/Grid 布局
  - CSS 动画和过渡
  - 渐变和阴影效果
  - 响应式设计
- **JavaScript (ES6+)**：
  - 模块化架构
  - Async/Await 异步处理
  - localStorage 数据持久化
  - Canvas 2D 绘图

### API 集成

- **OpenAI Chat Completions API**：故事和习俗生成
- **兼容 iflow API**：支持国内 AI 服务

### 开发工具

- 纯原生开发，无框架依赖
- 模块化文件结构
- Git 版本控制

---

## 📁 项目结构

```
spring-festival/
├── index.html          # 主页入口
├── story.html          # 故事生成器页面
├── customs.html        # 习俗查询页面
├── common.css          # 公共样式
├── common.js           # 公共功能
├── story.css           # 故事模块样式
├── story.js            # 故事模块逻辑
├── customs.css         # 习俗模块样式
├── customs.js          # 习俗模块逻辑
├── LICENSE             # MIT 协议
└── README.md           # 项目文档
```

### 模块说明

| 文件 | 功能 |
|------|------|
| `index.html` | 主页，包含模块卡片导航、春节倒计时、API 配置 |
| `story.html` | 故事生成器，支持风格选择、年龄选择、成就系统 |
| `customs.html` | 习俗查询，支持省份选择、AI 查询结果展示 |
| `common.css/js` | 共享样式和功能（烟花、对联、倒计时） |
| `story.css/js` | 故事生成器专用样式和逻辑 |
| `customs.css/js` | 习俗查询专用样式和逻辑 |

---

## 🚀 快速开始

### 前置要求

- 现代浏览器（Chrome 80+、Firefox 75+、Safari 13+、Edge 80+）
- 本地 HTTP 服务器（可选，用于本地测试）

### 安装运行

1. **克隆项目**
```bash
git clone https://gitee.com/li7hai26/spring-festival.git
cd spring-festival
```

2. **本地运行**

使用 Python：
```bash
python3 -m http.server 8000
```

使用 Node.js：
```bash
npx http-server -p 8000
```

3. **访问应用**
```
http://localhost:8000
```

### API 配置

1. 打开主页，点击右上角 `⚙️` 配置按钮
2. 填写 API 信息：
   - **API URL**：`https://apis.iflow.cn/v1`（默认）
   - **API Key**：你的 iflow API Key
   - **模型名称**：`iflow-rome-30ba3b`（默认）
3. 点击"保存配置"

> 💡 **提示**：获取 iflow API Key 请访问 [platform.iflow.cn](https://platform.iflow.cn/profile?tab=apiKey)

---

## ⚙️ 配置说明

### API 配置

应用支持两种 API 配置方式：

#### 1. iflow API（推荐）

```javascript
{
  apiUrl: "https://apis.iflow.cn/v1",
  apiKey: "sk-your-api-key",
  modelName: "iflow-rome-30ba3b"
}
```

#### 2. OpenAI API

```javascript
{
  apiUrl: "https://api.openai.com/v1",
  apiKey: "sk-your-openai-key",
  modelName: "gpt-3.5-turbo"
}
```

### 提示词配置

故事生成提示词模板：

```
你是一个擅长创作春节年兽故事的作家。请根据以下要求创作一个故事：

风格：{style}
适合年龄：{ageRange}
主题：关于年兽的故事
要求：{prompt}

请确保：
1. 故事主题围绕年兽，不得偏离
2. 内容积极向上，符合春节氛围
3. 语言生动有趣，适合目标年龄段
4. 字数在300-800字之间
```

习俗查询提示词模板：

```
请提供{province}地区的春节习俗和礼仪信息。

要求：
1. 必须基于真实的传统文化知识，不得编造虚假信息
2. 只提供真实的、有据可查的习俗信息
3. 不要编造不存在的内容
4. 不要提供不确定的网页链接
5. 介绍要详细、准确，包括具体做法和寓意
```

---

## 🎨 设计理念

### 视觉设计

- **配色方案**：红色（#C41E3A）+ 金色（#FFD700）
- **字体选择**：苹方、微软雅黑，清晰易读
- **动画效果**：流畅过渡，不卡顿
- **响应式**：320px - 1920px 全屏适配

### 用户体验

- **直观导航**：顶部导航栏 + 页脚返回链接
- **即时反馈**：加载动画、操作提示
- **数据安全**：本地存储，不上传服务器
- **无障碍**：语义化标签，辅助技术友好

---

## 📊 数据存储

### localStorage 结构

```javascript
// API 配置
{
  apiUrl: "https://apis.iflow.cn/v1",
  apiKey: "sk-xxx",
  modelName: "iflow-rome-30ba3b"
}

// 成就状态
{
  first_story: { unlocked: true, unlockedAt: 1234567890 },
  // ... 其他成就
}

// 故事历史
[
  {
    id: 1,
    prompt: "年兽和小男孩的故事",
    style: "traditional",
    ageRange: "7-12",
    content: "故事内容...",
    timestamp: 1234567890
  }
]

// 习俗查询缓存
{
  "beijing": {
    query: "北京春节习俗",
    result: "习俗内容...",
    timestamp: 1234567890
  }
}
```

---

## 🌐 浏览器支持

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |
| Opera | 67+ |

### 功能支持

- ✅ Canvas 2D
- ✅ localStorage
- ✅ CSS Grid/Flexbox
- ✅ ES6+ JavaScript
- ✅ Fetch API

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发规范

1. 遵循现有代码风格
2. 添加必要的注释
3. 确保响应式兼容
4. 测试各种浏览器

### 提交格式

```
type(scope): subject

type: feat, fix, docs, style, refactor, test, chore
scope: 影响的模块
subject: 简短描述
```

---

## 📝 更新日志

### v1.0.0 (2026-02-04)

#### 新增功能
- ✨ 模块化架构重构
- ✨ 故事生成器模块
- ✨ 习俗查询模块
- ✨ 成就系统（11个成就）
- ✨ 烟花粒子特效
- ✨ 春节对联（AI + 降级）
- ✨ 春节倒计时
- ✨ 顶部导航栏
- ✨ 全屏加载遮罩

#### 优化改进
- 🎨 优化返回按钮样式
- 🎨 优化 z-index 层级管理
- 🎨 优化响应式布局
- 🔧 移除语音朗读功能
- 🔧 修复对联初始化问题
- 🔧 修复倒计时遮挡问题

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 🙏 致谢

- 🚀 **iflow CLI** - 感谢 iflow CLI 的大力支持
- 🎨 **OpenAI** - 提供 AI API 服务
- 🌟 **社区贡献者** - 感谢所有提出建议和反馈的用户

---

## 📮 联系方式

- 项目地址：[Gitee](https://gitee.com/li7hai26/spring-festival)
- 问题反馈：[Issues](https://gitee.com/li7hai26/spring-festival/issues)

---

<div align="center">

**⭐ 如果觉得项目有帮助，请给个 Star 支持！**

Made with ❤️ for Spring Festival

</div>