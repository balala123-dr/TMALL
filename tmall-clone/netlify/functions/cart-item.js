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

  // 从路径中提取cartId: /api/cart/{cartId}
  const pathParts = event.path.split('/')
  const cartIdIndex = pathParts.findIndex(part => part === 'cart')
  const cartId = cartIdIndex !== -1 ? pathParts[cartIdIndex + 1] : null

  if (!cartId || isNaN(cartId)) {
    return createResponse(400, {
      success: false,
      message: '购物车ID无效'
    })
  }

  const supabase = getSupabaseClient()
  const userId = getUserIdFromToken(event.headers.authorization || event.headers.Authorization)

  if (!userId) {
    return createResponse(401, {
      success: false,
      message: '请先登录'
    })
  }

  // PUT - 更新购物车项
  if (event.httpMethod === 'PUT') {
    try {
      const cartData = parseBody(event)
      console.log('🛒 更新购物车项:', cartId, cartData)

      const { data, error } = await supabase
        .from('cart')
        .update({
          cart_quantity: cartData.quantity
        })
        .eq('cart_id', cartId)
        .eq('cart_user_id', userId) // 确保只能更新自己的购物车
        .select()

      if (error) {
        if (error.message && error.message.includes('relation "cart" does not exist')) {
          return createResponse(500, {
            success: false,
            message: '购物车功能暂时不可用',
            error: '购物车表不存在'
          })
        }
        throw error
      }

      if (!data || data.length === 0) {
        return createResponse(404, {
          success: false,
          message: '购物车项不存在或无权限'
        })
      }

      console.log('✅ 更新购物车成功')
      return createResponse(200, {
        success: true,
        message: '更新购物车成功',
        data: data[0]
      })
    } catch (error) {
      console.error('❌ 更新购物车错误:', error)
      return createResponse(500, {
        success: false,
        message: '更新购物车失败',
        error: error.message
      })
    }
  }

  // DELETE - 删除购物车项
  if (event.httpMethod === 'DELETE') {
    try {
      console.log('🛒 删除购物车项:', cartId)

      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('cart_id', cartId)
        .eq('cart_user_id', userId) // 确保只能删除自己的购物车

      if (error) {
        if (error.message && error.message.includes('relation "cart" does not exist')) {
          return createResponse(500, {
            success: false,
            message: '购物车功能暂时不可用',
            error: '购物车表不存在'
          })
        }
        throw error
      }

      console.log('✅ 删除购物车成功')
      return createResponse(200, {
        success: true,
        message: '删除购物车成功'
      })
    } catch (error) {
      console.error('❌ 删除购物车错误:', error)
      return createResponse(500, {
        success: false,
        message: '删除购物车失败',
        error: error.message
      })
    }
  }

  return createResponse(405, { success: false, message: '方法不允许' })
}

