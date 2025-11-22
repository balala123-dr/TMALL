const { getSupabaseClient, createResponse } = require('./_utils/supabase')

// 从 token 中提取用户 ID
function getUserIdFromToken(authHeader) {
  if (!authHeader) return null
  const token = authHeader.replace('Bearer ', '')
  const userId = token.split('-')[2]
  return userId ? parseInt(userId) : null
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
    // 从路径中提取订单ID: /api/orders/{orderId}
    const pathParts = event.path.split('/')
    const orderIdIndex = pathParts.findIndex(part => part === 'orders')
    const orderId = orderIdIndex !== -1 ? pathParts[orderIdIndex + 1] : null

    if (!orderId) {
      return createResponse(400, {
        success: false,
        message: '订单ID不能为空'
      })
    }

    const userId = getUserIdFromToken(event.headers.authorization || event.headers.Authorization)
    if (!userId) {
      return createResponse(401, {
        success: false,
        message: '请先登录'
      })
    }

    console.log('📋 获取订单详情:', orderId)
    const supabase = getSupabaseClient()

    // 获取订单主信息
    const { data: order, error: orderError } = await supabase
      .from('product_order')
      .select('*')
      .eq('product_order_id', orderId)
      .eq('product_order_user_id', userId)
      .single()

    if (orderError || !order) {
      return createResponse(404, {
        success: false,
        message: '订单不存在或无权限'
      })
    }

    // 获取订单明细
    const { data: items, error: itemsError } = await supabase
      .from('product_order_item')
      .select('*')
      .eq('product_order_item_order_id', orderId)

    if (itemsError) {
      console.error('❌ 获取订单明细失败:', itemsError)
    }

    // 获取每个商品的详细信息
    const itemsWithProducts = await Promise.all((items || []).map(async (item) => {
      const { data: product } = await supabase
        .from('product')
        .select('*')
        .eq('product_id', item.product_order_item_product_id)
        .single()

      // 获取商品图片
      const { data: images } = await supabase
        .from('product_image')
        .select('product_image_src')
        .eq('product_image_product_id', item.product_order_item_product_id)
        .limit(1)

      return {
        ...item,
        product: product ? {
          ...product,
          product_images: images || []
        } : null
      }
    }))

    console.log('✅ 获取订单详情成功')
    return createResponse(200, {
      success: true,
      message: '获取订单详情成功',
      data: {
        ...order,
        items: itemsWithProducts
      }
    })
  } catch (error) {
    console.error('❌ 获取订单详情错误:', error)
    return createResponse(500, {
      success: false,
      message: '获取订单详情失败',
      error: error.message
    })
  }
}

