# 🚀 Netlify 部署步骤指南

## 第一步：提交代码到 Git 仓库 ⭐（当前步骤）

你的项目已经连接到 Git 仓库，但还有一些新文件需要提交。请按以下步骤操作：

### 1. 添加所有新文件到 Git

```powershell
# 在 tmall-clone 目录下执行
git add .
```

### 2. 提交更改

```powershell
git commit -m "添加 Netlify 部署配置和 Functions"
```

### 3. 推送到远程仓库

```powershell
git push origin main
```

---

## 第二步：在 Netlify 上创建新项目

### 1. 登录 Netlify
访问 [https://app.netlify.com/](https://app.netlify.com/) 并登录

### 2. 创建新项目
- 点击 **"Add new project"** 按钮
- 选择 **"Import an existing project"**
- 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
- 授权 Netlify 访问你的仓库
- 选择你的仓库（tmall-clone）

### 3. 配置构建设置
Netlify 会自动检测 `netlify.toml` 文件，但请确认以下设置：

- **Build command**: `npm run build` ✅（已自动配置）
- **Publish directory**: `dist` ✅（已自动配置）
- **Functions directory**: `netlify/functions` ✅（已自动配置）

### 4. 配置环境变量（重要！）

在部署之前，必须添加环境变量。点击 **"Show advanced"** 或 **"Environment variables"**，添加：

#### 必需的环境变量：
```
VITE_SUPABASE_URL = 你的 Supabase 项目 URL
VITE_SUPABASE_ANON_KEY = 你的 Supabase Anon Key
```

#### 推荐的环境变量：
```
SUPABASE_SERVICE_ROLE_KEY = 你的 Supabase Service Role Key
```

**如何获取这些值：**
1. 登录你的 Supabase 项目
2. 进入 **Settings** → **API**
3. 复制：
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`（在页面底部，需要展开）

### 5. 开始部署
点击 **"Deploy site"** 按钮

---

## 第三步：等待部署完成

1. Netlify 会自动：
   - 安装依赖（`npm install`）
   - 构建项目（`npm run build`）
   - 部署前端和 Functions

2. 部署完成后，你会看到：
   - 一个自动生成的 URL（如 `https://random-name-123.netlify.app`）
   - 可以点击访问你的网站

---

## 第四步：测试部署

访问你的网站，测试以下功能：
- ✅ 用户注册
- ✅ 用户登录
- ✅ 浏览商品分类
- ✅ 查看商品列表
- ✅ 添加商品到购物车
- ✅ 创建订单

---

## 常见问题

### 问题 1：构建失败
- 检查环境变量是否正确设置
- 查看 Netlify 构建日志中的错误信息

### 问题 2：API 请求失败
- 确认环境变量已正确设置
- 检查 Netlify Functions 日志

### 问题 3：需要更新代码
- 提交代码到 Git
- Netlify 会自动重新部署

---

## 快速命令参考

```powershell
# 提交并推送代码
git add .
git commit -m "更新代码"
git push origin main

# Netlify 会自动检测并重新部署
```

---

## 下一步

部署成功后，你可以：
1. 在 Netlify 项目设置中配置自定义域名
2. 设置自动部署（每次推送到 main 分支时自动部署）
3. 查看部署日志和函数日志

