import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('缺少Supabase配置')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUserTable() {
  try {
    console.log('正在检查user表结构...')
    
    // 检查表是否存在
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user')
    
    if (tablesError) {
      console.log('使用information_schema查询失败，尝试直接查询user表...')
    } else {
      console.log('表是否存在:', tables.length > 0 ? '是' : '否')
    }
    
    // 尝试直接查询user表结构
    const { data: users, error: queryError } = await supabase
      .from('user')
      .select('*')
      .limit(1)
    
    if (queryError) {
      console.error('查询user表错误:', queryError)
    } else {
      console.log('user表结构示例:')
      if (users && users.length > 0) {
        console.log(JSON.stringify(users[0], null, 2))
      } else {
        console.log('表中暂无数据，但表结构正常')
      }
    }
    
    // 检查是否有user_create_date字段
    console.log('\n测试插入数据（不包含user_create_date）...')
    
    const testData = {
      user_name: `test_${Date.now()}`,
      user_password: 'testpassword'
    }
    
    const { data: insertResult, error: insertError } = await supabase
      .from('user')
      .insert([testData])
      .select()
    
    if (insertError) {
      console.error('插入测试数据错误:', insertError)
    } else {
      console.log('插入成功:', insertResult)
    }
    
  } catch (error) {
    console.error('检查过程中发生错误:', error)
  }
}

checkUserTable()