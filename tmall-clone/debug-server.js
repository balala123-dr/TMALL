console.log('🔍 开始调试服务器启动问题...')

// 检查Node.js版本
console.log('Node.js版本:', process.version)

// 加载环境变量
import { config } from 'dotenv'
config()

// 检查环境变量
console.log('环境变量检查:')
console.log('- PORT:', process.env.PORT || '3001 (默认)')
console.log('- SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '已设置' : '未设置')
console.log('- SUPABASE_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '已设置' : '未设置')

try {
  // 测试导入模块
  console.log('📦 测试模块导入...')
  const express = await import('express')
  console.log('✅ express 导入成功')
  
  const cors = await import('cors')
  console.log('✅ cors 导入成功')
  
  const bcrypt = await import('bcryptjs')
  console.log('✅ bcryptjs 导入成功')
  
  const { createClient } = await import('@supabase/supabase-js')
  console.log('✅ supabase 导入成功')

  // 测试创建Express应用
  console.log('🚀 创建Express应用...')
  const app = express.default()
  console.log('✅ Express应用创建成功')

  // 测试Supabase连接
  console.log('🔗 测试Supabase连接...')
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  
  // 简单测试路由
  app.get('/test', (req, res) => {
    res.json({ message: '服务器运行正常!', time: new Date().toISOString() })
  })

  // 启动服务器
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`🎉 服务器成功启动在端口 ${PORT}`)
    console.log(`🌐 测试地址: http://localhost:${PORT}/test`)
  })

} catch (error) {
  console.error('❌ 启动失败:', error)
  process.exit(1)
}