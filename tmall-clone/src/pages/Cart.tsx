import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect, useCallback } from 'react'
import { buildApiUrl } from '../lib/apiConfig'

interface CartItem {
  cart_id: number
  id: number
  product_id: number
  product_name: string
  product_title: string
  product_price: number
  product_sale_price?: number
  quantity: number
  selected_size: string
  selected_color: string
  product_image: string
}

export default function Cart() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCartItems = useCallback(async () => {
    try {
      if (!user) {
        setLoading(false)
        return
      }

      const token = localStorage.getItem('token')
      const response = await fetch(buildApiUrl('/cart'), {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      const result = await response.json()

      if (result.success) {
        setCartItems(result.data)
      } else {
        console.error('获取购物车失败:', result.message)
        setCartItems([])
      }
      setLoading(false)
    } catch (error) {
      console.error('获取购物车失败:', error)
      setCartItems([])
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCartItems()
  }, [fetchCartItems])

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity <= 0) return
    if (!user) return
    
    try {
      const token = localStorage.getItem('token')
      
      // 找到对应的购物车项ID
      const cartItem = cartItems.find(item => item.id === id)
      if (!cartItem) return
      
      // 调用API更新数量
      const response = await fetch(buildApiUrl(`/cart/${cartItem.cart_id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ quantity: newQuantity })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // 更新本地状态
        const updatedItems = cartItems.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
        setCartItems(updatedItems)
      } else {
        console.error('更新数量失败:', result.message)
        alert('更新数量失败')
      }
    } catch (error) {
      console.error('更新数量错误:', error)
      alert('更新数量失败')
    }
  }

  const removeItem = async (id: number) => {
    if (!user) return
    
    try {
      const token = localStorage.getItem('token')
      
      // 找到对应的购物车项ID
      const cartItem = cartItems.find(item => item.id === id)
      if (!cartItem) return
      
      // 调用API删除商品
      const response = await fetch(buildApiUrl(`/cart/${cartItem.cart_id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        // 更新本地状态
        const updatedItems = cartItems.filter(item => item.id !== id)
        setCartItems(updatedItems)
      } else {
        console.error('删除商品失败:', result.message)
        alert('删除商品失败')
      }
    } catch (error) {
      console.error('删除商品错误:', error)
      alert('删除商品失败')
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product_sale_price || item.product_price
      return total + (price * item.quantity)
    }, 0)
  }

  const goToCheckout = async () => {
    if (cartItems.length === 0) {
      alert('购物车是空的')
      return
    }

    if (!user) {
      alert('请先登录后再结算')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product_id,
          quantity: item.quantity,
          price: item.product_sale_price || item.product_price
        })),
        cartItems: cartItems, // 传递购物车项，用于结算后清空购物车
        addressCode: '000000', // 默认地址码，实际应用中应该从用户地址获取
        detailAddress: '默认收货地址', // 默认地址，实际应用中应该从用户地址获取
        receiver: user.user_nickname || user.user_name,
        mobile: '13800138000' // 默认手机号，实际应用中应该从用户信息获取
      }

      const response = await fetch(buildApiUrl('/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (result.success) {
        alert('订单创建成功！订单号：' + result.data.orderCode)
        // 重新获取购物车数据（应该为空）
        fetchCartItems()
        // 跳转到订单页面
        navigate('/orders')
      } else {
        alert('订单创建失败：' + result.message)
      }
    } catch (error) {
      console.error('创建订单错误:', error)
      alert('网络错误，请稍后再试')
    }
  }

  const goShopping = () => {
    navigate('/')
  }

  if (!user) {
    return (
      <div className="tmall-page">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '20px' }}>
            请先登录
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
            登录后才能查看购物车
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 24px',
              background: '#ff0036',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            去登录
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="tmall-page">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px'
        }}>
          <div style={{ fontSize: '16px', color: '#666' }}>加载购物车中...</div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="tmall-page">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '20px' }}>
            购物车是空的
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
            快去选购心仪的商品吧
          </p>
          <button
            onClick={goShopping}
            style={{
              padding: '12px 24px',
              background: '#ff0036',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            去购物
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="tmall-page">
      {/* 最顶部细条 */}
      <div style={{ 
        height: '30px', 
        background: '#fff', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        fontSize: '12px',
        color: '#333'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>0.0</span>
          <span>欢迎来天猫</span>
          <span>Hi, {user.user_nickname || user.user_name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="#" style={{ color: '#666', textDecoration: 'none' }}>我的淘宝</a>
          <a href="#" style={{ color: '#ff0036', textDecoration: 'none', fontWeight: '600' }}>购物车</a>
          <a href="#" style={{ color: '#666', textDecoration: 'none' }}>收藏夹</a>
          <a href="#" style={{ color: '#666', textDecoration: 'none' }}>手机版</a>
          <a href="#" style={{ color: '#666', textDecoration: 'none' }}>淘宝网</a>
          <a href="#" style={{ color: '#666', textDecoration: 'none' }}>商家支持</a>
          <a href="#" style={{ color: '#666', textDecoration: 'none' }}>网站导航</a>
        </div>
      </div>

      {/* 主头部区域 */}
      <header style={{ padding: '16px 40px', background: '#fff', borderBottom: '2px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto' }}>
          {/* 左侧：Logo和标语 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0, position: 'relative' }}>
            <div style={{ fontSize: '28px', color: '#ff0036', fontWeight: 700, letterSpacing: '2px', lineHeight: '1' }}>
              TMALL
            </div>
            <div style={{ fontSize: '12px', color: '#333', fontWeight: 400, lineHeight: '1' }}>理想生活上天猫</div>
          </div>

          {/* 中间：搜索框区域 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 40px' }}>
            <div style={{ display: 'flex', gap: '0', width: '100%', maxWidth: '600px' }}>
              <input
                type="text"
                placeholder="搜索 天猫 商品/品牌/店铺"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '2px solid #ff0036',
                  borderRadius: '4px 0 0 4px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                style={{
                  padding: '10px 28px',
                  background: '#ff0036',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0 4px 4px 0',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                搜索
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 购物车内容 */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '20px auto', 
        padding: '0 20px'
      }}>
        <h1 style={{ fontSize: '24px', color: '#333', marginBottom: '20px', borderBottom: '2px solid #ff0036', paddingBottom: '10px', display: 'inline-block' }}>
          我的购物车
        </h1>

        <div style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          {/* 表头 */}
          <div style={{
            display: 'flex',
            padding: '15px 20px',
            background: '#f8f8f8',
            borderBottom: '1px solid #eee',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
          }}>
            <div style={{ flex: '4' }}>商品信息</div>
            <div style={{ flex: '1', textAlign: 'center' }}>单价</div>
            <div style={{ flex: '1', textAlign: 'center' }}>数量</div>
            <div style={{ flex: '1', textAlign: 'center' }}>小计</div>
            <div style={{ flex: '1', textAlign: 'center' }}>操作</div>
          </div>

          {/* 购物车商品列表 */}
          {cartItems.map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              padding: '20px',
              borderBottom: '1px solid #eee',
              fontSize: '14px'
            }}>
              {/* 商品信息 */}
              <div style={{ flex: '4', display: 'flex', gap: '15px' }}>
                <img 
                  src={item.product_image}
                  alt={item.product_name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #eee'
                  }}
                />
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#333' }}>
                    {item.product_name}
                  </h3>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
                    {item.product_title}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#666' }}>
                    <span>尺码: {item.selected_size}</span>
                    <span>颜色: {item.selected_color}</span>
                  </div>
                </div>
              </div>

              {/* 单价 */}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {item.product_sale_price ? (
                  <div>
                    <div style={{ color: '#ff0036', fontWeight: '600' }}>¥{item.product_sale_price}</div>
                    <div style={{ color: '#999', textDecoration: 'line-through', fontSize: '12px' }}>¥{item.product_price}</div>
                  </div>
                ) : (
                  <div style={{ color: '#333', fontWeight: '600' }}>¥{item.product_price}</div>
                )}
              </div>

              {/* 数量 */}
              <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{
                      padding: '6px 10px',
                      border: 'none',
                      background: '#f5f5f5',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    -
                  </button>
                  <div style={{
                    padding: '6px 12px',
                    fontSize: '14px',
                    minWidth: '30px',
                    textAlign: 'center'
                  }}>
                    {item.quantity}
                  </div>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{
                      padding: '6px 10px',
                      border: 'none',
                      background: '#f5f5f5',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 小计 */}
              <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '600', color: '#ff0036' }}>
                ¥{((item.product_sale_price || item.product_price) * item.quantity).toFixed(2)}
              </div>

              {/* 操作 */}
              <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    padding: '6px 12px',
                    background: 'none',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 结算区域 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          padding: '20px',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <div>
            <button
              onClick={goShopping}
              style={{
                padding: '10px 20px',
                background: '#fff',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              继续购物
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '16px', color: '#333' }}>
              已选择 <span style={{ color: '#ff0036', fontWeight: '600' }}>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span> 件商品
            </div>
            <div style={{ fontSize: '16px', color: '#333' }}>
              合计: <span style={{ color: '#ff0036', fontSize: '20px', fontWeight: '600' }}>¥{calculateTotal().toFixed(2)}</span>
            </div>
            <button
              onClick={goToCheckout}
              style={{
                padding: '12px 30px',
                background: '#ff0036',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              结算
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}