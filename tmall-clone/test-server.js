console.log('开始测试服务器...')

try {
  // 测试require导入
  const express = require('express')
  console.log('✅ express 导入成功')
  
  const cors = require('cors')
  console.log('✅ cors 导入成功')
  
  const bcrypt = require('bcryptjs')
  console.log('✅ bcryptjs 导入成功')
  
  const { createClient } = require('@supabase/supabase-js')
  console.log('✅ supabase 导入成功')
  
  require('dotenv').config()
  console.log('✅ dotenv 配置成功')
  
  // 测试环境变量
  console.log('环境变量检查:')
  console.log('- SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '已设置' : '未设置')
  console.log('- SUPABASE_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '已设置' : '未设置')
  
  // 创建简单服务器
  const app = express()
  const PORT = 3001
  
  app.use(cors())
  app.use(express.json())
  
  app.get('/test', (req, res) => {
    res.json({ message: '测试成功!', time: new Date() })
  })
  
  app.listen(PORT, () => {
    console.log('✅ 测试服务器启动成功! 端口:', PORT)
  })
  
} catch (error) {
  console.error('❌ 测试失败:', error)
  process.exit(1)
}