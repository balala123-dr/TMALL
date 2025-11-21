// 检查数据库表结构

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

async function checkTables() {
  try {
    console.log('📋 检查数据库表结构...')
    
    // 获取所有表
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tablesError) {
      console.error('❌ 获取表列表失败:', tablesError)
      
      // 尝试使用替代方法
      console.log('\n🔄 尝试使用系统表获取信息...')
      const { data: schema, error: schemaError } = await supabase
        .rpc('get_schema')
      
      if (schemaError) {
        console.error('❌ 获取数据库结构失败:', schemaError)
        console.log('\n📝 请手动检查以下表是否存在:')
        console.log('- user (用户表)')
        console.log('- category (分类表)')
        console.log('- product (商品表)')
        console.log('- product_image (商品图片表)')
        console.log('- cart (购物车表) - 需要创建')
        console.log('- order (订单表) - 需要创建')
        console.log('- order_item (订单项表) - 需要创建')
        
        return
      }
    } else {
      console.log('✅ 数据库中的表:')
      tables.forEach(table => {
        console.log(`- ${table.table_name}`)
      })
    }
    
    // 检查是否存在购物车表
    const { data: cartColumns, error: cartError } = await supabase
      .from('cart')
      .select('*')
      .limit(1)
    
    if (cartError) {
      console.log('\n❌ 购物车表不存在:', cartError.message)
      console.log('🔧 需要创建购物车表')
    } else {
      console.log('\n✅ 购物车表存在')
    }
    
    // 检查是否存在订单表
    const { data: orderColumns, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .limit(1)
    
    if (orderError) {
      console.log('❌ 订单表不存在:', orderError.message)
      console.log('🔧 需要创建订单表')
    } else {
      console.log('✅ 订单表存在')
    }
    
  } catch (error) {
    console.error('❌ 检查数据库失败:', error)
  }
}

// 执行检查
checkTables()