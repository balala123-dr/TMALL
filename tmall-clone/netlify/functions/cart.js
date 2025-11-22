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

  const supabase = getSupabaseClient()
  const userId = getUserIdFromToken(event.headers.authorization || event.headers.Authorization)

  // GET - 获取购物车
  if (event.httpMethod === 'GET') {
    try {
      console.log('🛒 获取购物车...')

      if (!userId) {
        return createResponse(401, {
          success: false,
          message: '请先登录'
        })
      }

      const { data: cartItems, error: cartError } = await supabase
        .from('cart')
        .select(`
          *,
          product:cart_product_id (
            product_name,
            product_title,
            product_price,
            product_sale_price,
            product_image (
              product_image_src
            )
          )
        `)
        .eq('cart_user_id', userId)

      if (cartError) {
        if (cartError.message && cartError.message.includes('relation "cart" does not exist')) {
          console.log('⚠️ 购物车表不存在，返回空数组')
          return createResponse(200, {
            success: true,
            message: '获取购物车成功',
            data: []
          })
        }
        throw cartError
      }

      // 格式化购物车数据
      const formattedCartItems = cartItems.map(item => {
        const imageSrc = item.product?.product_image &&
          item.product.product_image.length > 0 &&
          item.product.product_image[0].product_image_src

        return {
          id: item.cart_id,
          cart_id: item.cart_id,
          product_id: item.cart_product_id,
          product_name: item.product?.product_name || '未知商品',
          product_title: item.product?.product_title || '',
          product_price: item.product?.product_price || 0,
          product_sale_price: item.product?.product_sale_price,
          quantity: item.cart_quantity,
          selected_size: item.cart_selected_size,
          selected_color: item.cart_selected_color,
          product_image: imageSrc
        }
      })

      console.log('✅ 获取购物车成功:', formattedCartItems.length, '件商品')
      return createResponse(200, {
        success: true,
        message: '获取购物车成功',
        data: formattedCartItems
      })
    } catch (error) {
      console.error('❌ 获取购物车错误:', error)
      return createResponse(500, {
        success: false,
        message: '获取购物车失败',
        error: error.message
      })
    }
  }

  // POST - 添加到购物车
  if (event.httpMethod === 'POST') {
    try {
      const cartData = parseBody(event)
      console.log('🛒 收到添加到购物车请求:', cartData)

      if (!userId) {
        return createResponse(401, {
          success: false,
          message: '请先登录'
        })
      }

      // 检查商品是否已在购物车中
      const { data: existingItem, error: checkError } = await supabase
        .from('cart')
        .select('*')
        .eq('cart_user_id', userId)
        .eq('cart_product_id', cartData.productId)
        .maybeSingle()

      if (checkError && !checkError.message.includes('No rows') && !checkError.message.includes('PGRST116')) {
        throw checkError
      }

      let result
      if (existingItem) {
        // 如果已存在，更新数量
        const newQuantity = existingItem.cart_quantity + (cartData.quantity || 1)
        const { data, error } = await supabase
          .from('cart')
          .update({
            cart_quantity: newQuantity,
            cart_selected_size: cartData.selectedSize || existingItem.cart_selected_size,
            cart_selected_color: cartData.selectedColor || existingItem.cart_selected_color
          })
          .eq('cart_id', existingItem.cart_id)
          .select()

        if (error) throw error
        result = { data, message: '更新购物车成功' }
      } else {
        // 如果不存在，添加新项
        const { data, error } = await supabase
          .from('cart')
          .insert([{
            cart_user_id: userId,
            cart_product_id: cartData.productId,
            cart_quantity: cartData.quantity || 1,
            cart_selected_size: cartData.selectedSize || '',
            cart_selected_color: cartData.selectedColor || ''
          }])
          .select()

        if (error) throw error
        result = { data, message: '添加到购物车成功' }
      }

      console.log('✅ 操作购物车成功')
      return createResponse(201, {
        success: true,
        message: result.message,
        data: result.data[0]
      })
    } catch (error) {
      console.error('❌ 操作购物车错误:', error)
      return createResponse(500, {
        success: false,
        message: '操作购物车失败',
        error: error.message
      })
    }
  }

  return createResponse(405, { success: false, message: '方法不允许' })
}

