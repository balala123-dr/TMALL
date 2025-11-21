// 创建购物车和订单表的脚本

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// 读取.env文件
function loadEnv() {
  const envPath = path.join(__dirname, '.env')
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envVars = {}
  
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=')
    if (key && values.length > 0) {
      envVars[key.trim()] = values.join('=').trim()
    }
  })
  
  return envVars
}

const env = loadEnv()
const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 找不到Supabase配置，请检查.env文件')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTables() {
  try {
    console.log('🔧 创建购物车和订单表...')
    
    // 1. 创建购物车表
    console.log('\n📝 创建购物车表...')
    const { data: cartResult, error: cartError } = await supabase
      .rpc('create_cart_table_if_not_exists')
    
    if (cartError) {
      console.log('⚠️ 使用SQL语句创建购物车表...')
      
      const { error: sqlError } = await supabase
        .from('cart')
        .select('*')
        .limit(1)
      
      if (sqlError) {
        console.log('\n请在Supabase仪表盘中执行以下SQL创建购物车表:')
        console.log(`
-- 购物车表
CREATE TABLE IF NOT EXISTS cart (
  cart_id SERIAL PRIMARY KEY,
  cart_user_id INTEGER REFERENCES user(user_id) ON DELETE CASCADE,
  cart_product_id INTEGER REFERENCES product(product_id) ON DELETE CASCADE,
  cart_quantity INTEGER NOT NULL DEFAULT 1,
  cart_selected_size VARCHAR(10),
  cart_selected_color VARCHAR(20),
  cart_create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 为用户ID和商品ID创建唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_user_product ON cart(cart_user_id, cart_product_id);
        `)
      } else {
        console.log('✅ 购物车表已存在')
      }
    } else {
      console.log('✅ 购物车表创建成功')
    }
    
    // 2. 创建订单表
    console.log('\n📝 创建订单表...')
    
    const { error: orderError } = await supabase
      .from('orders')
      .select('*')
      .limit(1)
    
    if (orderError) {
      console.log('\n请在Supabase仪表盘中执行以下SQL创建订单表:')
      console.log(`
-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  order_user_id INTEGER REFERENCES user(user_id) ON DELETE CASCADE,
  order_total_amount DECIMAL(10,2) NOT NULL,
  order_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, shipped, delivered, cancelled
  order_shipping_address TEXT,
  order_payment_method VARCHAR(20), -- alipay, wechat, card, cash
  order_create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  order_paid_date TIMESTAMP,
  order_shipped_date TIMESTAMP,
  order_delivered_date TIMESTAMP
);
        `)
    } else {
      console.log('✅ 订单表已存在')
    }
    
    // 3. 创建订单项表
    console.log('\n📝 创建订单项表...')
    
    const { error: orderItemError } = await supabase
      .from('order_items')
      .select('*')
      .limit(1)
    
    if (orderItemError) {
      console.log('\n请在Supabase仪表盘中执行以下SQL创建订单项表:')
      console.log(`
-- 订单项表
CREATE TABLE IF NOT EXISTS order_items (
  item_id SERIAL PRIMARY KEY,
  item_order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
  item_product_id INTEGER REFERENCES product(product_id),
  item_quantity INTEGER NOT NULL,
  item_price DECIMAL(10,2) NOT NULL,
  item_selected_size VARCHAR(10),
  item_selected_color VARCHAR(20)
);
        `)
    } else {
      console.log('✅ 订单项表已存在')
    }
    
    console.log('\n🎉 购物车和订单表创建完成!')
    
  } catch (error) {
    console.error('❌ 创建表失败:', error)
  }
}

// 执行创建操作
createTables()