// 购物车和订单API的补充代码
// 请将此代码复制并添加到supabase-server.cjs中

// 购物车相关API
if (req.url.startsWith('/api/cart') && req.method === 'GET') {
  try {
    // 验证用户登录状态
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      res.writeHead(401, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({
        success: false,
        message: '请先登录'
      }))
    }
    
    // 从token获取用户信息
    const userId = 1 // 简化处理，实际应该从token解析
    
    console.log('🛒 获取购物车列表，用户ID:', userId)
    
    // 获取购物车商品
    const { data: cartItems, error: cartError } = await supabase
      .from('cart')
      .select(`
        cart_id,
        cart_product_id,
        cart_quantity,
        cart_selected_size,
        cart_selected_color,
        product:product_id(
          product_name,
          product_title,
          product_price,
          product_sale_price
        )
      `)
      .eq('cart_user_id', userId)
      .eq('product.product_is_enabled', true)
    
    if (cartError) throw cartError
    
    // 获取商品图片
    const cartWithImages = await Promise.all(cartItems.map(async (item) => {
      const { data: images, error: imageError } = await supabase
        .from('product_image')
        .select('product_image_src')
        .eq('product_image_product_id', item.cart_product_id)
        .limit(1)
      
      // 使用默认图片或数据库中的图片
      const imageUrl = imageError || !images || images.length === 0
        ? `https://picsum.photos/seed/${item.cart_product_id}-${encodeURIComponent(item.product?.product_name)}/100/100.jpg`
        : images[0].product_image_src
      
      return {
        ...item,
        product_image: imageUrl
      }
    }))
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      success: true,
      message: '获取购物车成功',
      data: cartWithImages
    }))
  } catch (error) {
    console.error('❌ 获取购物车错误:', error)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      success: false,
      message: '获取购物车失败',
      error: error.message
    }))
  }
  return
}

// 添加商品到购物车
if (req.url.startsWith('/api/cart') && req.method === 'POST') {
  try {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    
    req.on('end', async () => {
      try {
        const { productId, quantity, selectedSize, selectedColor } = JSON.parse(body)
        
        // 验证用户登录状态
        const token = req.headers.authorization?.replace('Bearer ', '')
        if (!token) {
          res.writeHead(401, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({
            success: false,
            message: '请先登录'
          }))
        }
        
        // 从token获取用户信息
        const userId = 1 // 简化处理，实际应该从token解析
        
        console.log('🛒 添加商品到购物车:', productId, '用户ID:', userId)
        
        // 检查商品是否存在
        const { data: product, error: productError } = await supabase
          .from('product')
          .select('product_id, product_name, product_is_enabled')
          .eq('product_id', productId)
          .single()
        
        if (productError || !product || !product.product_is_enabled) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({
            success: false,
            message: '商品不存在或已下架'
          }))
        }
        
        // 检查购物车中是否已存在相同商品
        const { data: existingItem, error: existingError } = await supabase
          .from('cart')
          .select('*')
          .eq('cart_user_id', userId)
          .eq('cart_product_id', productId)
          .eq('cart_selected_size', selectedSize)
          .eq('cart_selected_color', selectedColor)
          .single()
        
        if (existingError && existingError.code !== 'PGRST116') { // PGRST116是"未找到"的错误码
          throw existingError
        }
        
        let result
        if (existingItem) {
          // 如果已存在，更新数量
          const { data, error } = await supabase
            .from('cart')
            .update({ 
              cart_quantity: existingItem.cart_quantity + quantity 
            })
            .eq('cart_id', existingItem.cart_id)
            .select()
          
          result = { data, error }
        } else {
          // 如果不存在，添加新记录
          const { data, error } = await supabase
            .from('cart')
            .insert({
              cart_user_id: userId,
              cart_product_id: productId,
              cart_quantity: quantity,
              cart_selected_size: selectedSize,
              cart_selected_color: selectedColor
            })
            .select()
          
          result = { data, error }
        }
        
        if (result.error) throw result.error
        
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          success: true,
          message: '添加到购物车成功',
          data: result.data[0]
        }))
      } catch (error) {
        console.error('❌ 添加到购物车错误:', error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          success: false,
          message: '添加到购物车失败',
          error: error.message
        }))
      }
    })
  } catch (error) {
    console.error('❌ 请求处理错误:', error)
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      success: false,
      message: '请求格式错误'
    }))
  }
  return
}

// 更新购物车商品数量
if (req.url.match(/^\/api\/cart\/\d+$/) && req.method === 'PUT') {
  try {
    const cartId = parseInt(req.url.split('/').pop())
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    
    req.on('end', async () => {
      try {
        const { quantity } = JSON.parse(body)
        
        // 验证用户登录状态
        const token = req.headers.authorization?.replace('Bearer ', '')
        if (!token) {
          res.writeHead(401, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({
            success: false,
            message: '请先登录'
          }))
        }
        
        // 从token获取用户信息
        const userId = 1 // 简化处理，实际应该从token解析
        
        // 验证购物车项是否属于当前用户
        const { data: cartItem, error: checkError } = await supabase
          .from('cart')
          .select('*')
          .eq('cart_id', cartId)
          .eq('cart_user_id', userId)
          .single()
        
        if (checkError || !cartItem) {
          res.writeHead(404, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({
            success: false,
            message: '购物车项不存在'
          }))
        }
        
        // 更新数量
        const { data, error } = await supabase
          .from('cart')
          .update({ cart_quantity: Math.max(1, quantity) })
          .eq('cart_id', cartId)
          .select()
        
        if (error) throw error
        
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          success: true,
          message: '更新数量成功',
          data: data[0]
        }))
      } catch (error) {
        console.error('❌ 更新购物车错误:', error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          success: false,
          message: '更新数量失败',
          error: error.message
        }))
      }
    })
  } catch (error) {
    console.error('❌ 请求处理错误:', error)
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      success: false,
      message: '请求格式错误'
    }))
  }
  return
}

// 从购物车删除商品
if (req.url.match(/^\/api\/cart\/\d+$/) && req.method === 'DELETE') {
  try {
    const cartId = parseInt(req.url.split('/').pop())
    
    // 验证用户登录状态
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      res.writeHead(401, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({
        success: false,
        message: '请先登录'
      }))
    }
    
    // 从token获取用户信息
    const userId = 1 // 简化处理，实际应该从token解析
    
    // 验证购物车项是否属于当前用户
    const { data: cartItem, error: checkError } = await supabase
      .from('cart')
      .select('*')
      .eq('cart_id', cartId)
      .eq('cart_user_id', userId)
      .single()
    
    if (checkError || !cartItem) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({
        success: false,
        message: '购物车项不存在'
      }))
    }
    
    // 删除购物车项
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('cart_id', cartId)
    
    if (error) throw error
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      success: true,
      message: '删除成功'
    }))
  } catch (error) {
    console.error('❌ 删除购物车项错误:', error)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      success: false,
      message: '删除失败',
      error: error.message
    }))
  }
  return
}

// 创建订单
if (req.url === '/api/orders' && req.method === 'POST') {
  try {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    
    req.on('end', async () => {
      try {
        const { cartItems, shippingAddress, paymentMethod } = JSON.parse(body)
        
        // 验证用户登录状态
        const token = req.headers.authorization?.replace('Bearer ', '')
        if (!token) {
          res.writeHead(401, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({
            success: false,
            message: '请先登录'
          }))
        }
        
        // 从token获取用户信息
        const userId = 1 // 简化处理，实际应该从token解析
        
        // 计算订单总金额
        const totalAmount = cartItems.reduce((total, item) => {
          const price = item.product_sale_price || item.product_price
          return total + (price * item.quantity)
        }, 0)
        
        // 创建订单
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            order_user_id: userId,
            order_total_amount: totalAmount,
            order_status: 'pending',
            order_shipping_address: shippingAddress,
            order_payment_method: paymentMethod,
            order_create_date: new Date().toISOString()
          })
          .select()
        
        if (orderError) throw orderError
        
        const orderId = order[0].order_id
        
        // 创建订单项
        const orderItemsToInsert = cartItems.map(item => ({
          item_order_id: orderId,
          item_product_id: item.product_id,
          item_quantity: item.quantity,
          item_price: item.product_sale_price || item.product_price,
          item_selected_size: item.selected_size,
          item_selected_color: item.selected_color
        }))
        
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsToInsert)
          .select()
        
        if (itemsError) throw itemsError
        
        // 清空购物车中的已购买商品
        const cartIds = cartItems.map(item => item.cart_id)
        const { error: clearError } = await supabase
          .from('cart')
          .delete()
          .in('cart_id', cartIds)
        
        if (clearError) throw clearError
        
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          success: true,
          message: '订单创建成功',
          data: {
            order,
            orderItems
          }
        }))
      } catch (error) {
        console.error('❌ 创建订单错误:', error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          success: false,
          message: '创建订单失败',
          error: error.message
        }))
      }
    })
  } catch (error) {
    console.error('❌ 请求处理错误:', error)
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      success: false,
      message: '请求格式错误'
    }))
  }
  return
}