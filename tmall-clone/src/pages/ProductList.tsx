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
  product_images: ProductImage[]
  category?: {
    category_name: string
  }
}

interface Category {
  category_id: number
  category_name: string
  icon: string
}

export default function ProductList() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(buildApiUrl('/categories'))
        const result = await response.json()
        
        if (result.success) {
          // 设置当前分类
          const currentCategory = result.data.find((c: Category) => c.category_id.toString() === categoryId)
          setCategory(currentCategory || null)
        }
      } catch (error) {
        console.error('获取分类失败:', error)
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${buildApiUrl('/products')}?categoryId=${categoryId}`)
        const result = await response.json()
        
        if (result.success) {
          setProducts(result.data)
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error('获取商品失败:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
    fetchProducts()
  }, [categoryId])

  const goBack = () => {
    navigate('/')
  }

  // 图片加载失败时的处理函数
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget
    target.style.display = 'none'
    const placeholder = document.createElement('div')
    placeholder.style.width = '100%'
    placeholder.style.height = '100%'
    placeholder.style.display = 'flex'
    placeholder.style.alignItems = 'center'
    placeholder.style.justifyContent = 'center'
    placeholder.style.color = '#666'
    placeholder.style.fontSize = '14px'
    placeholder.style.background = '#f8f8f8'
    placeholder.textContent = '商品图片'
    target.parentNode?.appendChild(placeholder)
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
          <Link to="/cart" style={{ color: '#666', textDecoration: 'none' }}>购物车</Link>
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

      {/* 内容区域 */}
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
          <a href="#" onClick={goBack} style={{ color: '#666', textDecoration: 'none' }}>首页</a>
          <span>/</span>
          <span style={{ color: '#ff0036' }}>{category?.category_name || '商品分类'}</span>
        </div>

        {/* 分类标题 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
        }}>
          <h1 style={{ 
            color: '#333', 
            fontSize: '24px', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {category?.icon && <span>{category.icon}</span>}
            {category?.category_name || '商品分类'}
          </h1>
          <button 
            onClick={goBack}
            style={{
              padding: '8px 16px',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            返回首页
          </button>
        </div>

        {/* 商品展示区域 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '16px', color: '#666' }}>加载商品中...</div>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '16px', color: '#666' }}>暂无商品</div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            padding: '20px 0',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}>
            {products.map((product) => (
              <div key={product.product_id} style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer',
                border: '1px solid #f0f0f0',
                flex: '0 0 calc(25% - 18px)', // 每行4个商品
                maxWidth: '240px',
                minWidth: '200px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'
                e.currentTarget.style.borderColor = '#ff0036'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                e.currentTarget.style.borderColor = '#f0f0f0'
              }}
              >
                <div style={{
                  height: '200px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {product.product_images && product.product_images.length > 0 && product.product_images[0].product_image_src ? (
                    <img 
                      src={product.product_images[0].product_image_src}
                      alt={product.product_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={handleImageError}
                    />
                  ) : (
                    <img 
                      src={`https://picsum.photos/seed/${product.product_id}-${encodeURIComponent(product.product_name)}/240/200.jpg`}
                      alt={product.product_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={handleImageError}
                    />
                  )}
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '1.3'
                  }}>
                    {product.product_name}
                  </h3>
                  <div style={{
                    fontSize: '14px',
                    color: '#666',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    marginBottom: '15px',
                    lineHeight: '1.4',
                    minHeight: '40px'
                  }}>
                    {product.product_title}
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div>
                      <span style={{
                        color: '#ff0036',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        lineHeight: '1'
                      }}>
                        ¥{product.product_sale_price || product.product_price}
                      </span>
                      {product.product_sale_price && (
                        <span style={{
                          color: '#999',
                          fontSize: '13px',
                          textDecoration: 'line-through',
                          marginLeft: '10px',
                          lineHeight: '1'
                        }}>
                          ¥{product.product_price}
                        </span>
                      )}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px',
                      width: '100%'
                    }}>
                      <button 
                        onClick={async () => {
                          if (!user) {
                            alert('请先登录后再添加购物车')
                            navigate('/login')
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
                                quantity: 1,
                                selectedSize: 'M', // 默认尺码
                                selectedColor: '黑色' // 默认颜色
                              })
                            })
                            
                            const result = await response.json()
                            
                            if (result.success) {
                              alert('已添加到购物车')
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
                          padding: '8px 12px',
                          backgroundColor: '#fff',
                          color: '#ff0036',
                          border: '1px solid #ff0036',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          transition: 'all 0.2s ease-in-out',
                          whiteSpace: 'nowrap',
                          flex: '1',
                          minWidth: '0',
                          textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fff0f0'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#fff'
                        }}>
                        加购物车
                      </button>
                      <button 
                        onClick={() => {
                          // 跳转到商品详情页
                          navigate(`/product/${product.product_id}`)
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#ff0036',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          transition: 'all 0.2s ease-in-out',
                          boxShadow: '0 2px 4px rgba(255,0,54,0.3)',
                          whiteSpace: 'nowrap',
                          flex: '1',
                          minWidth: '0',
                          textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e6002f'
                          e.currentTarget.style.transform = 'scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ff0036'
                          e.currentTarget.style.transform = 'scale(1)'
                        }}>
                        立即购买
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}