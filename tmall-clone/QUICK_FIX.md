# 🚀 快速修复购物车问题

## 最简单的方法（3步搞定）

### 步骤1：在 Supabase 中执行 SQL

1. 打开 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 点击左侧菜单的 **SQL Editor**
4. 点击 **New query**
5. 复制并粘贴 `fix-cart-complete.sql` 文件的全部内容
6. 点击 **Run** 执行

### 步骤2：配置 Service Role Key（推荐）

1. 在 Supabase Dashboard 中，点击 **Settings** → **API**
2. 找到 **service_role** 密钥（⚠️ 这是敏感信息，不要分享给任何人）
3. 复制这个密钥
4. 在你的项目根目录创建或编辑 `.env` 文件，添加：
   ```
   SUPABASE_SERVICE_ROLE_KEY=你复制的service_role密钥
   ```
   ⚠️ 确保 `.env` 文件在 `.gitignore` 中，不会被提交到代码仓库

### 步骤3：重启后端服务器

```bash
# 停止当前服务器（按 Ctrl+C）
# 重新启动
node supabase-server.cjs
```

查看控制台，应该显示：
```
✅ 使用Service Role Key（可绕过RLS）
```

## ✅ 完成！

现在尝试添加商品到购物车，应该可以正常工作了。

---

## 🔒 安全提示

- ❌ **永远不要**在聊天、邮件或公开场合分享你的密钥
- ✅ **只在本地** `.env` 文件中存储密钥
- ✅ 确保 `.env` 在 `.gitignore` 中
- ✅ Service Role Key 有完全访问权限，只用于后端服务器

## 🆘 如果还有问题

查看后端控制台的错误信息，然后参考 `CART_TROUBLESHOOTING.md` 获取详细帮助。

