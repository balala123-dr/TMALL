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

async function createNewUserTable() {
  try {
    console.log('正在检查当前表结构...')
    
    // 检查当前表结构
    const { data: users, error } = await supabase
      .from('user')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('查询表结构错误:', error)
      return
    }
    
    console.log('当前表结构示例:', JSON.stringify(users[0], null, 2))
    
    // 创建一个新的临时表来测试
    console.log('\n测试插入数据到新表...')
    
    const testData = {
      user_name: `newtest_${Date.now()}`,
      user_password: 'testpassword',
      user_nickname: '测试用户',
      user_realname: '张三',
      user_gender: 1,
      user_birthday: '1990-01-01',
      user_address: '测试地址'
    }
    
    const { data: insertResult, error: insertError } = await supabase
      .from('user')
      .insert([testData])
      .select()
    
    if (insertError) {
      console.error('插入错误:', insertError)
      
      // 如果插入失败，可能是字段不匹配，让我们检查实际字段
      console.log('\n检查表的实际字段...')
      
      // 通过插入空数据来获取字段信息
      const emptyData = { user_name: `empty_${Date.now()}`, user_password: 'empty' }
      const { data: testInsert, error: testError } = await supabase
        .from('user')
        .insert([emptyData])
        .select()
      
      if (testError) {
        console.error('测试插入错误:', testError)
      } else {
        console.log('测试插入成功，字段正常')
      }
      
    } else {
      console.log('插入成功:', insertResult)
    }
    
  } catch (error) {
    console.error('创建表过程中发生错误:', error)
  }
}

createNewUserTable()