const { getSupabaseClient, parseBody, createResponse } = require('./_utils/supabase')

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

  if (event.httpMethod !== 'PUT') {
    return createResponse(405, { success: false, message: '方法不允许' })
  }

  try {
    // 从路径中提取订单ID: /api/orders/{orderId}/status
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

    const { status } = parseBody(event)
    console.log(`📝 更新订单 ${orderId} 状态为:`, status)

    const supabase = getSupabaseClient()

    // 验证订单是否属于当前用户
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

    // 更新订单状态
    const { data: updatedOrder, error: updateError } = await supabase
      .from('product_order')
      .update({ product_order_status: status })
      .eq('product_order_id', orderId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ 更新订单状态失败:', updateError)
      return createResponse(500, {
        success: false,
        message: '更新订单状态失败',
        error: updateError.message
      })
    }

    console.log('✅ 更新订单状态成功')
    return createResponse(200, {
      success: true,
      message: '更新订单状态成功',
      data: updatedOrder
    })
  } catch (error) {
    console.error('❌ 更新订单状态错误:', error)
    return createResponse(500, {
      success: false,
      message: '更新订单状态失败',
      error: error.message
    })
  }
}

