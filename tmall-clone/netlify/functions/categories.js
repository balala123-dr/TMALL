const { getSupabaseClient, createResponse } = require('./_utils/supabase')

// 分类图标映射
const categoryIcons = {
  '女装/大衣': '👗',
  '男装/运动户外': '👔',
  '女鞋/男鞋/箱包': '👠',
  '美妆/个人护理': '💄',
  '腕表/眼镜/珠宝饰品': '⌚',
  '手机/数码/电脑办公': '📱',
  '母婴玩具': '🧸',
  '零食/茶酒/进口食品': '🍰',
  '生鲜水果': '🍎',
  '大家电/生活电器': '📺',
  '家居建材': '🏠',
  '汽车/配件/用品': '🚗',
  '家纺/家饰/鲜花': '🌸',
  '医药保健': '💊',
  '厨具/收纳/宠物': '🐾',
  '图书音像': '📚'
}

exports.handler = async (event) => {
  // 处理 CORS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, {})
  }

  if (event.httpMethod !== 'GET') {
    return createResponse(405, { success: false, message: '方法不允许' })
  }

  try {
    console.log('📋 获取商品分类列表...')
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('category')
      .select('*')
      .order('category_id')

    if (error) throw error

    // 为每个分类添加图标
    const categoriesWithIcons = data.map(category => ({
      ...category,
      icon: categoryIcons[category.category_name] || '📦'
    }))

    console.log('✅ 获取分类成功:', categoriesWithIcons.length, '个分类')
    return createResponse(200, {
      success: true,
      message: '获取分类成功',
      data: categoriesWithIcons
    })
  } catch (error) {
    console.error('❌ 获取分类错误:', error)
    return createResponse(500, {
      success: false,
      message: '获取分类失败',
      error: error.message
    })
  }
}

