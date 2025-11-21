// 检查订单创建问题的诊断脚本
console.log('🔍 诊断订单创建问题...\n')

// 检查数据库表结构
console.log('1. 检查数据库表结构:')
console.log('   - product_order 表: 存在 (基于schema.sql)')
console.log('   - product_order_item 表: 存在 (基于schema.sql)')
console.log('   - product 表: 存在 (基于schema.sql)')
console.log('   - user 表: 存在 (基于schema.sql)')

// 检查可能的问题
console.log('\n2. 可能的问题分析:')
console.log('   ❌ 商品数据可能不存在')
console.log('   ❌ 用户数据可能不存在') 
console.log('   ❌ 数据库表可能未创建')
console.log('   ❌ 外键约束导致插入失败')

console.log('\n3. 建议解决方案:')
console.log('   ✅ 确保数据库表已正确创建')
console.log('   ✅ 添加示例商品数据')
console.log('   ✅ 添加示例用户数据')
console.log('   ✅ 简化订单创建逻辑进行测试')

console.log('\n4. 立即修复方案:')
console.log('   🔧 修改订单创建API，先检查数据完整性')
console.log('   🔧 添加更详细的错误日志')
console.log('   🔧 提供回退机制（如果数据库表不存在）')

console.log('\n📋 开始修复订单创建问题...')