# 🚀 Cloudflare 部署指南

本指南介绍如何将 AI 春节年兽故事生成器部署到 Cloudflare Pages。

---

## 📋 前置准备

1. **Cloudflare 账号**
   - 注册 Cloudflare 账号：https://dash.cloudflare.com/sign-up

2. **Git 仓库**
   - 项目已托管在 Gitee：https://gitee.com/li7hai26/spring-festival
   - 或 GitHub（建议使用 GitHub）

3. **本地环境**（可选）
   - 安装 Node.js
   - 安装 Wrangler CLI

---

## 🌟 方式一：通过 Cloudflare Dashboard 部署（推荐）

### 步骤 1：登录 Cloudflare Dashboard

访问：https://dash.cloudflare.com/

### 步骤 2：创建 Pages 项目

1. 点击左侧菜单 **Workers & Pages**
2. 点击 **Create application**
3. 选择 **Pages** 标签页
4. 点击 **Create a project**

### 步骤 3：连接 Git 仓库

#### 选项 A：使用 GitHub（推荐）

1. 点击 **Connect to Git**
2. 授权 Cloudflare 访问你的 GitHub 账号
3. 选择 `spring-festival` 仓库
4. 点击 **Begin setup**

#### 选项 B：使用 Gitee

1. 将 Gitee 仓库迁移到 GitHub
2. 然后按照选项 A 操作

### 步骤 4：配置构建设置

```yaml
项目名称: spring-festival
生产分支: main
构建命令: （留空）
构建输出目录: （留空，默认为根目录）
环境变量: （无需配置）
```

点击 **Save and Deploy**

### 步骤 5：等待部署完成

- 部署通常需要 1-3 分钟
- 部署成功后会显示一个随机域名（如：https://spring-festival.pages.dev）

### 步骤 6：自定义域名（可选）

1. 在 Pages 项目中点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名（如：spring-festival.yourdomain.com）
4. 按照提示配置 DNS 记录

---

## 🛠️ 方式二：使用 Wrangler CLI 部署

### 步骤 1：安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 步骤 2：登录 Cloudflare

```bash
wrangler login
```

浏览器会打开 Cloudflare 授权页面，点击授权。

### 步骤 3：部署到 Pages

```bash
# 在项目根目录执行
cd /Users/li7hai26/workspace/spring-festival
wrangler pages project create spring-festival
wrangler pages deploy . --project-name=spring-festival
```

### 步骤 4：查看部署状态

```bash
wrangler pages deployment list --project-name=spring-festival
```

---

## 🔄 方式三：使用 Git 集成自动部署

### 步骤 1：在 Cloudflare 创建 Pages 项目

按照方式一的步骤 1-4 创建项目。

### 步骤 2：配置自动部署

在项目设置中：
- **生产分支**：`main`
- **构建命令**：留空
- **构建输出目录**：留空

### 步骤 3：推送代码触发部署

```bash
git add .
git commit -m "chore: 准备 Cloudflare Pages 部署"
git push
```

Cloudflare 会自动检测到推送并开始部署。

---

## ⚙️ 配置说明

### wrangler.toml 文件

项目已包含 `wrangler.toml` 配置文件：

```toml
name = "spring-festival"
compatibility_date = "2024-01-01"

[site]
bucket = "./"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

**说明：**
- `name`：项目名称
- `bucket`：静态文件目录（根目录）
- `redirects`：SPA 路由重定向（可选）

### 环境变量（可选）

如果需要配置默认 API Key，可以在 Cloudflare Pages 设置中添加环境变量：

```bash
API_URL=https://apis.iflow.cn/v1
API_KEY=sk-your-api-key
MODEL_NAME=iflow-rome-30ba3b
```

然后在 `common.js` 中使用：

```javascript
const apiUrl = import.meta.env.API_URL || localStorage.getItem('apiUrl') || 'https://apis.iflow.cn/v1';
```

---

## 🌐 域名配置

### Cloudflare 提供的免费域名

部署成功后，Cloudflare 会提供一个免费域名：
- 格式：`https://your-project-name.pages.dev`
- 示例：`https://spring-festival.pages.dev`

### 自定义域名（需要自有域名）

1. 在 Cloudflare 购买或添加域名
2. 在 Pages 项目中添加自定义域名
3. 配置 DNS 记录：

```
类型: CNAME
名称: spring-festival
目标: your-project-name.pages.dev
代理: 已开启（橙色云朵）
```

---

## 🔍 验证部署

### 检查部署状态

访问 Cloudflare Dashboard → Workers & Pages → spring-festival

查看：
- ✅ 部署状态
- ✅ 部署日志
- ✅ 访问统计

### 测试网站

1. 打开部署的域名
2. 测试各个功能模块：
   - 故事生成器
   - 习俗查询
   - 春节倒计时
   - API 配置

### 检查控制台

按 F12 打开浏览器开发者工具，检查：
- ✅ 控制台无错误
- ✅ 资源加载正常
- ✅ API 调用成功

---

## 🛡️ 安全配置

### HTTPS

Cloudflare Pages 默认提供免费 SSL 证书：
- ✅ 自动 HTTPS
- ✅ HTTP/2 支持
- ✅ HSTS 可选

### 访问控制（可选）

如果需要限制访问：

1. **密码保护**（需要 Cloudflare Access）
2. **IP 白名单**（需要 Cloudflare WAF）
3. **地理位置限制**（需要 Cloudflare WAF）

---

## 📊 性能优化

### Cloudflare 自动优化

Cloudflare Pages 自动提供：
- ✅ 全球 CDN 加速
- ✅ 图片优化
- ✅ 代码压缩
- ✅ 缓存策略
- ✅ HTTP/3 支持

### 手动优化建议

1. **压缩资源**
   - 已使用最小化 CSS/JS
   - 图片使用 WebP 格式

2. **缓存策略**
   ```javascript
   // common.js
   localStorage.setItem('apiConfig', JSON.stringify(config));
   ```

3. **懒加载**（如需要）
   ```javascript
   const images = document.querySelectorAll('img[data-src]');
   ```

---

## 🐛 故障排除

### 问题 1：部署失败

**解决方案：**
1. 检查 Git 仓库是否公开
2. 检查文件路径是否正确
3. 查看部署日志

### 问题 2：页面空白

**解决方案：**
1. 检查浏览器控制台错误
2. 确认所有文件都已上传
3. 检查相对路径是否正确

### 问题 3：API 调用失败

**解决方案：**
1. 检查 API Key 是否正确
2. 检查 API URL 是否可访问
3. 检查 CORS 配置

### 问题 4：重定向问题

**解决方案：**
1. 检查 `wrangler.toml` 中的 redirect 配置
2. 确认路由规则是否正确

---

## 📈 监控和分析

### Cloudflare Analytics

访问 Dashboard → Analytics 查看：
- 📊 访问量统计
- 🌍 地理分布
- 📱 设备分布
- ⚡ 性能指标

### 自定义分析（可选）

添加 Google Analytics：

```html
<!-- index.html -->
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_TRACKING_ID');
  </script>
</head>
```

---

## 🔄 更新部署

### 更新代码

```bash
# 修改代码后
git add .
git commit -m "feat: 添加新功能"
git push
```

Cloudflare 会自动检测推送并重新部署。

### 手动触发部署

1. 访问 Cloudflare Dashboard
2. 进入项目页面
3. 点击 **Retry deployment**

### 部署历史

查看所有部署记录：
- Dashboard → Workers & Pages → 项目名 → Deployments

---

## 💰 成本说明

### Cloudflare Pages 免费计划

- ✅ 无限带宽
- ✅ 无限请求
- ✅ 全球 CDN
- ✅ 自动 HTTPS
- ✅ 20,000 次构建/月
- ✅ 100 个 Pages 项目

**总计：完全免费！**

### 付费计划（如需要）

- Pro：$20/月
  - 更多构建次数
  - 高级分析
  - 优先支持

---

## 📚 参考资料

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare 教程](https://developers.cloudflare.com/pages/tutorials/)

---

## 🎉 完成！

部署完成后，你将拥有：
- 🌍 全球访问速度极快的网站
- 🔒 自动 HTTPS 加密
- 💰 完全免费托管
- 📊 详细的访问统计
- 🔄 自动持续部署

祝使用愉快！🚀