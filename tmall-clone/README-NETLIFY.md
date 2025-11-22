# Netlify 部署指南

本指南将帮助你将天猫克隆项目部署到 Netlify。

## 📋 前置要求

1. 一个 Netlify 账户（免费版即可）
2. 一个 Supabase 项目（用于数据库）
3. Git 仓库（GitHub、GitLab 或 Bitbucket）

## 🚀 部署步骤

### 1. 准备环境变量

在 Netlify 部署之前，你需要设置以下环境变量：

#### 必需的环境变量：
- `VITE_SUPABASE_URL` - 你的 Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY` - 你的 Supabase Anon Key

#### 推荐的环境变量：
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase Service Role Key（用于绕过 RLS 策略）

### 2. 部署到 Netlify

#### 方法一：通过 Netlify 网站部署

1. 登录 [Netlify](https://app.netlify.com/)
2. 点击 "Add new site" → "Import an existing project"
3. 连接你的 Git 仓库
4. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. 点击 "Show advanced" 添加环境变量：
   - 添加 `VITE_SUPABASE_URL`
   - 添加 `VITE_SUPABASE_ANON_KEY`
   - 添加 `SUPABASE_SERVICE_ROLE_KEY`（推荐）
6. 点击 "Deploy site"

#### 方法二：通过 Netlify CLI 部署

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 初始化项目
netlify init

# 设置环境变量
netlify env:set VITE_SUPABASE_URL "your-supabase-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "your-service-role-key"

# 部署
netlify deploy --prod
```

### 3. 配置 Netlify Functions

项目已经配置好了 Netlify Functions，位于 `netlify/functions/` 目录：

- `register.js` - 用户注册
- `login.js` - 用户登录
- `categories.js` - 获取商品分类
- `products.js` - 获取商品列表
- `orders.js` - 订单相关（创建、列表）
- `orders-detail.js` - 订单详情
- `orders-status.js` - 更新订单状态
- `cart.js` - 购物车（获取、添加）
- `cart-item.js` - 购物车项（更新、删除）

### 4. 验证部署

部署完成后，访问你的 Netlify 网站 URL，测试以下功能：

- ✅ 用户注册和登录
- ✅ 浏览商品分类和列表
- ✅ 查看商品详情
- ✅ 添加到购物车
- ✅ 创建订单
- ✅ 查看订单列表和详情

## 🔧 项目结构

```
tmall-clone/
├── netlify.toml              # Netlify 配置文件
├── netlify/
│   └── functions/            # Netlify Functions
│       ├── _utils/
│       │   └── supabase.js   # 共享的 Supabase 工具
│       ├── register.js
│       ├── login.js
│       ├── categories.js
│       ├── products.js
│       ├── orders.js
│       ├── orders-detail.js
│       ├── orders-status.js
│       ├── cart.js
│       └── cart-item.js
├── src/
│   └── lib/
│       └── apiConfig.ts      # API 配置（自动适配开发/生产环境）
└── dist/                     # 构建输出目录
```

## 📝 环境变量说明

### 开发环境
在开发环境中，前端会使用 `http://localhost:3001/api` 作为 API 基础 URL。

### 生产环境（Netlify）
在生产环境中，前端会自动使用 `/api` 作为 API 基础 URL，Netlify 会自动将其重定向到对应的 Netlify Functions。

## 🐛 常见问题

### 1. Functions 部署失败
- 检查 `netlify/functions/` 目录是否存在
- 确认 `netlify.toml` 中的 `functions` 路径正确
- 查看 Netlify 构建日志中的错误信息

### 2. API 请求失败
- 检查环境变量是否正确设置
- 确认 Supabase 项目配置正确
- 查看浏览器控制台和 Netlify Functions 日志

### 3. CORS 错误
- Netlify Functions 已经配置了 CORS 头
- 如果仍有问题，检查 Supabase 的 CORS 设置

### 4. RLS 策略错误
- 确保设置了 `SUPABASE_SERVICE_ROLE_KEY` 环境变量
- 或者在 Supabase 中调整 RLS 策略

## 📚 相关文档

- [Netlify 文档](https://docs.netlify.com/)
- [Netlify Functions 文档](https://docs.netlify.com/functions/overview/)
- [Supabase 文档](https://supabase.com/docs)

## 🎉 完成！

部署成功后，你的项目就可以通过 Netlify 提供的 URL 访问了！

