import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { buildApiUrl } from '../lib/apiConfig'

interface ProductImage {
  product_image_src: string
}

interface Product {
  product_id: number
  product_name: string
  product_title: string
  product_price: number
  product_sale_price?: number
  product_category_id: number
  product_description?: string
  product_stock: number
  product_images: ProductImage[]
}

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // 这里需要创建获取单个商品的API
        // 暂时使用获取所有商品然后筛选的方式
        const response = await fetch(buildApiUrl('/products'))
        const result = await response.json()
        
        if (result.success) {
          const productDetail = result.data.find((p: Product) => p.product_id.toString() === productId)
          if (productDetail) {
            setProduct(productDetail)
          } else {
            console.error('未找到商品')
          }
        }
      } catch (error) {
        console.error('获取商品详情失败:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleBuyNow = async () => {
    if (!user) {
      alert('请先登录后再购买')
      navigate('/login')
      return
    }

    if (!product) {
      alert('商品信息加载中，请稍后再试')
      return
    }

    if (!selectedSize) {
      alert('请选择尺码')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const orderData = {
        items: [{
          productId: product.product_id,
          quantity: quantity,
          price: product.product_sale_price || product.product_price,
          size: selectedSize,
          color: selectedColor
        }],
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
        navigate('/orders')
      } else {
        console.error('订单创建失败详情:', result)
        
        // 提供更详细的错误信息
        let errorMessage = '订单创建失败'
        if (result.message) {
          errorMessage += ': ' + result.message
        }
        if (result.error) {
          errorMessage += ' (详细错误: ' + result.error + ')'
        }
        
        alert(errorMessage)
      }
    } catch (error) {
      console.error('创建订单错误:', error)
      alert('网络错误，请稍后再试')
    }
  }

  const goBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        加载商品详情中...
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        商品不存在
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
          {user ? (
            <>
              <span>Hi, {user.user_nickname || user.user_name}</span>
            </>
          ) : (
            <>
              <span>请登录</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="#" style={{ color: '#666', textDecoration: 'none' }}>我的淘宝</a>
          {user && (
            <Link to="/orders" style={{ color: '#666', textDecoration: 'none', marginLeft: '20px' }}>我的订单</Link>
          )}
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

          {/* 右侧：用户链接 */}
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
            <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>首页</Link>
            <Link to="/cart" style={{ color: '#666', textDecoration: 'none' }}>购物车</Link>
            {user && (
              <Link to="/orders" style={{ color: '#666', textDecoration: 'none' }}>我的订单</Link>
            )}
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

      {/* 二级导航栏 */}
      <nav style={{ padding: '10px 40px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', gap: '24px' }}>
          <a href="#" style={{ color: '#333', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
            <div style={{
              width: '18px',
              height: '18px',
              background: '#4caf50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: '#fff',
                borderRadius: '50%',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '3px',
                  left: '2px',
                  width: '3px',
                  height: '3px',
                  background: '#4caf50',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '3px',
                  right: '2px',
                  width: '3px',
                  height: '3px',
                  background: '#4caf50',
                  borderRadius: '50%'
                }}></div>
              </div>
            </div>
            <span>天猫超市</span>
          </a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>天猫国际</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>天猫会员</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>电器城</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>喵鲜生</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>医药馆</a>
        </div>
      </nav>

      {/* 商品详情内容 */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px',
        minHeight: '600px'
      }}>
        {/* 面包屑导航 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#666'
        }}>
          <a href="#" onClick={goBack} style={{ color: '#666', textDecoration: 'none' }}>返回</a>
          <span>/</span>
          <span style={{ color: '#ff0036' }}>{product.product_name}</span>
        </div>

        {/* 商品详情区域 */}
        <div style={{ 
          display: 'flex', 
          gap: '40px',
          background: '#fff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          {/* 左侧：商品图片 */}
          <div style={{ 
            flex: '0 0 500px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* 主图片 */}
            <div style={{
              width: '500px',
              height: '500px',
              background: '#f0f0f0',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={`https://picsum.photos/seed/${product.product_id}-${encodeURIComponent(product.product_name)}/500/500.jpg`}
                alt={product.product_name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            
            {/* 缩略图 */}
            <div style={{ 
              display: 'flex', 
              gap: '10px',
              justifyContent: 'center'
            }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  width: '60px',
                  height: '60px',
                  background: '#f8f8f8',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src={`https://picsum.photos/seed/${product.product_id}-${i}-${encodeURIComponent(product.product_name)}/60/60.jpg`}
                    alt={`${product.product_name} ${i}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：商品信息 */}
          <div style={{ 
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* 商品标题 */}
            <div>
              <h1 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#333',
                margin: '0 0 10px 0',
                lineHeight: '1.3'
              }}>
                {product.product_name}
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: '0',
                lineHeight: '1.4'
              }}>
                {product.product_title}
              </p>
            </div>

            {/* 价格区域 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '15px 0',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <span style={{
                color: '#ff0036',
                fontSize: '28px',
                fontWeight: 'bold'
              }}>
                ¥{product.product_sale_price || product.product_price}
              </span>
              {product.product_sale_price && (
                <span style={{
                  color: '#999',
                  fontSize: '16px',
                  textDecoration: 'line-through'
                }}>
                  ¥{product.product_price}
                </span>
              )}
            </div>

            {/* 尺码选择 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>尺码</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '10px 14px',
                      border: selectedSize === size ? '2px solid #ff0036' : '1px solid #ddd',
                      background: selectedSize === size ? '#fff5f5' : '#fff',
                      color: selectedSize === size ? '#ff0036' : '#333',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedSize === size ? '600' : '400',
                      transition: 'all 0.2s',
                      minWidth: '50px',
                      height: '44px',
                      textAlign: 'center',
                      lineHeight: '1.4',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* 颜色选择 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>颜色</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['黑色', '白色', '灰色', '红色', '蓝色'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: '10px 14px',
                      border: selectedColor === color ? '2px solid #ff0036' : '1px solid #ddd',
                      background: selectedColor === color ? '#fff5f5' : '#fff',
                      color: selectedColor === color ? '#ff0036' : '#333',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedColor === color ? '600' : '400',
                      transition: 'all 0.2s',
                      minWidth: '60px',
                      height: '44px',
                      textAlign: 'center',
                      lineHeight: '1.4',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box'
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* 数量选择 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>数量</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    padding: '10px 14px',
                    border: 'none',
                    background: '#f5f5f5',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    minWidth: '40px',
                    height: '44px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  -
                </button>
                <div style={{
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  minWidth: '40px',
                  height: '44px',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    padding: '10px 14px',
                    border: 'none',
                    background: '#f5f5f5',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    minWidth: '40px',
                    height: '44px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* 购买按钮 */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '12px',
              marginTop: '20px',
              width: '100%'
            }}>
              <button
                onClick={async () => {
                  if (!user) {
                    alert('请先登录后再添加购物车')
                    navigate('/login')
                    return
                  }

                  if (!product) {
                    alert('商品信息加载中，请稍后再试')
                    return
                  }

                  if (!selectedSize) {
                    alert('请选择尺码')
                    return
                  }

                  try {
                    const token = localStorage.getItem('token')
                    
                    // 调用API添加到购物车
                    const response = await fetch(buildApiUrl('/cart'), {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                      },
                      body: JSON.stringify({
                        productId: product.product_id,
                        quantity: quantity,
                        selectedSize: selectedSize,
                        selectedColor: selectedColor
                      })
                    })
                    
                    const result = await response.json()
                    
                    if (result.success) {
                      // 显示成功消息
                      setShowSuccessMessage(true)
                      setTimeout(() => {
                        setShowSuccessMessage(false)
                        // 跳转到购物车页面
                        navigate('/cart')
                      }, 1500)
                    } else {
                      console.error('添加到购物车失败:', result)
                      const errorMsg = result.details 
                        ? `${result.message}\n详情: ${result.details}`
                        : result.message || '添加到购物车失败'
                      alert(errorMsg)
                    }
                  } catch (error: any) {
                    console.error('添加到购物车错误:', error)
                    alert(`添加到购物车失败: ${error.message || '网络错误，请稍后再试'}`)
                  }
                }}
                style={{
                  flex: '1',
                  padding: '14px 20px',
                  background: '#fff',
                  color: '#ff0036',
                  border: '1px solid #ff0036',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  minWidth: '150px',
                  maxWidth: '50%',
                  textAlign: 'center',
                  lineHeight: '1.4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box',
                height: '50px'
                }}
              >
                加入购物车
              </button>
              <button
                onClick={handleBuyNow}
                style={{
                  flex: '1',
                  padding: '14px 20px',
                  background: '#ff0036',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  minWidth: '150px',
                  maxWidth: '50%',
                  textAlign: 'center',
                  lineHeight: '1.4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box',
                height: '50px'
                }}
              >
                立即购买
              </button>
            </div>
          </div>
        </div>

        {/* 成功消息 */}
        {showSuccessMessage && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#4caf50',
            color: '#fff',
            padding: '20px 40px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            ✓ 购买成功！
          </div>
        )}
      </main>
    </div>
  )
}