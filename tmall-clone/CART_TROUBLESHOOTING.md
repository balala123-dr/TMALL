# 购物车功能故障排除指南

## 问题：操作购物车失败

如果遇到"操作购物车失败"的错误，请按照以下步骤排查：

### 1. 检查后端服务器日志

查看后端控制台（运行 `node supabase-server.cjs` 的终端），查看具体的错误信息。

### 2. 常见问题和解决方案

#### 问题A：RLS策略阻止操作

**症状：**
- 错误信息包含 "row-level security"、"RLS" 或 "permission denied"
- 错误代码为 42501

**解决方案（选择其一）：**

**方案1：使用Service Role Key（推荐）**
1. 在Supabase项目设置中找到 Service Role Key
2. 在 `.env` 文件中添加：
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
3. 重启后端服务器

**方案2：禁用RLS（仅用于开发环境）**
1. 在Supabase SQL编辑器中执行 `disable-cart-rls.sql`
2. 或者执行 `fix-cart-rls.sql` 来创建允许所有操作的策略

#### 问题B：购物车表不存在

**症状：**
- 错误信息包含 "relation \"cart\" does not exist"

**解决方案：**
1. 在Supabase SQL编辑器中执行 `create-cart-table.sql`
2. 重启后端服务器

#### 问题C：外键约束错误

**症状：**
- 错误信息包含 "foreign key" 或 "violates foreign key constraint"

**解决方案：**
1. 确保用户已登录（用户ID有效）
2. 确保商品ID有效（商品存在于数据库中）

### 3. 快速修复步骤

1. **检查环境变量**
   ```bash
   # 确保 .env 文件包含：
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # 推荐添加
   ```

2. **在Supabase中执行SQL脚本**
   - 打开Supabase Dashboard
   - 进入 SQL Editor
   - 依次执行：
     1. `create-cart-table.sql` - 创建购物车表（如果表不存在）
     2. `disable-cart-rls.sql` - 禁用RLS（开发环境）

3. **重启后端服务器**
   ```bash
   # 停止当前服务器（Ctrl+C）
   # 重新启动
   node supabase-server.cjs
   ```

4. **检查后端日志**
   - 查看是否显示 "✅ 使用Service Role Key（可绕过RLS）"
   - 如果显示 "⚠️ 使用Anon Key（可能受RLS限制）"，需要配置Service Role Key

### 4. 验证修复

1. 确保用户已登录
2. 尝试添加商品到购物车
3. 查看后端控制台的详细错误信息（如果仍有问题）

### 5. 获取帮助

如果问题仍然存在，请提供：
- 后端控制台的完整错误日志
- `.env` 文件配置（隐藏敏感信息）
- Supabase项目中的表结构截图

