-- 修复购物车表的RLS策略（适用于自定义认证系统）
-- 如果使用service role key，可以不需要这个脚本

-- 方法1：完全禁用RLS（推荐用于开发环境）
ALTER TABLE cart DISABLE ROW LEVEL SECURITY;

-- 方法2：删除现有策略并创建允许所有操作的策略（用于开发）
DROP POLICY IF EXISTS "Users can view own cart items" ON cart;
DROP POLICY IF EXISTS "Users can insert own cart items" ON cart;
DROP POLICY IF EXISTS "Users can update own cart items" ON cart;
DROP POLICY IF EXISTS "Users can delete own cart items" ON cart;

-- 创建允许所有操作的策略（仅用于开发环境，不适用于生产环境）
CREATE POLICY "Allow all cart operations" ON cart
  FOR ALL
  USING (true)
  WITH CHECK (true);

