const { getSupabaseClient, parseBody, createResponse } = require('./_utils/supabase')

// 生成唯一订单编号
function generateOrderCode() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${year}${month}${day}${random}`
}

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

  // POST - 创建订单
  if (event.httpMethod === 'POST') {
    try {
      const orderData = parseBody(event)
      console.log('📦 收到创建订单请求:', orderData)

      if (!userId) {
        return createResponse(401, {
          success: false,
          message: '请先登录'
        })
      }

      // 生成订单编号
      const orderCode = generateOrderCode()

      // 计算订单总金额
      let totalAmount = 0
      orderData.items.forEach(item => {
        totalAmount += item.price * item.quantity
      })

      // 创建订单主记录
      const { data: order, error: orderError } = await supabase
        .from('product_order')
        .insert([{
          product_order_code: orderCode,
          product_order_address: orderData.addressCode || '000000',
          product_order_detail_address: orderData.detailAddress,
          product_order_post: orderData.postCode || '',
          product_order_receiver: orderData.receiver,
          product_order_mobile: orderData.mobile,
          product_order_user_id: userId,
          product_order_status: 0 // 0表示待付款
        }])
        .select()

      if (orderError) {
        console.error('❌ 创建订单失败:', orderError)
        return createResponse(500, {
          success: false,
          message: '创建订单失败',
          error: orderError?.message
        })
      }

      if (!order || order.length === 0) {
        return createResponse(500, {
          success: false,
          message: '创建订单失败: 无返回数据'
        })
      }

      const orderId = order[0].product_order_id

      // 创建订单明细记录
      const orderItems = orderData.items.map(item => ({
        product_order_item_number: item.quantity,
        product_order_item_price: item.price,
        product_order_item_product_id: item.productId,
        product_order_item_order_id: orderId,
        product_order_item_user_id: userId,
        product_order_item_user_message: item.message || ''
      }))

      const { error: itemsError } = await supabase
        .from('product_order_item')
        .insert(orderItems)

      if (itemsError) {
        console.error('❌ 创建订单明细失败:', itemsError)
        // 删除已创建的订单主记录
        await supabase
          .from('product_order')
          .delete()
          .eq('product_order_id', orderId)
        return createResponse(500, {
          success: false,
          message: '创建订单明细失败',
          error: itemsError?.message
        })
      }

      // 清空购物车中已下单的商品
      if (orderData.cartItems && orderData.cartItems.length > 0) {
        const cartItemIds = orderData.cartItems.map(item => item.cart_id)
        await supabase
          .from('cart')
          .delete()
          .in('cart_id', cartItemIds)
      }

      console.log('✅ 创建订单成功:', orderCode)
      return createResponse(201, {
        success: true,
        message: '创建订单成功',
        data: {
          orderId: orderId,
          orderCode: orderCode,
          totalAmount: totalAmount,
          status: 0
        }
      })
    } catch (error) {
      console.error('❌ 创建订单错误:', error)
      return createResponse(500, {
        success: false,
        message: '创建订单失败',
        error: error.message
      })
    }
  }

  // GET - 获取订单列表
  if (event.httpMethod === 'GET') {
    try {
      console.log('📋 获取订单列表...')

      if (!userId) {
        return createResponse(401, {
          success: false,
          message: '请先登录'
        })
      }

      const { data: orders, error } = await supabase
        .from('product_order')
        .select('*')
        .eq('product_order_user_id', userId)
        .order('product_order_create_date', { ascending: false })

      if (error) throw error

      // 获取每个订单的商品明细
      const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const { data: items } = await supabase
          .from('product_order_item')
          .select('*')
          .eq('product_order_item_order_id', order.product_order_id)

        // 获取每个商品的详细信息
        const itemsWithProducts = await Promise.all((items || []).map(async (item) => {
          const { data: product } = await supabase
            .from('product')
            .select('*')
            .eq('product_id', item.product_order_item_product_id)
            .single()

          return {
            ...item,
            product: product || null
          }
        }))

        return {
          ...order,
          items: itemsWithProducts
        }
      }))

      console.log('✅ 获取订单成功:', ordersWithItems.length, '个订单')
      return createResponse(200, {
        success: true,
        message: '获取订单成功',
        data: ordersWithItems
      })
    } catch (error) {
      console.error('❌ 获取订单错误:', error)
      return createResponse(500, {
        success: false,
        message: '获取订单失败',
        error: error.message
      })
    }
  }

  return createResponse(405, { success: false, message: '方法不允许' })
}

