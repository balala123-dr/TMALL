import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'
import '../App.css'

export default function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  // 页面加载时获取数据
  useEffect(() => {
    if (user) {
      console.log('✅ 当前登录用户信息:', user)
      console.log('✅ 用户ID:', user.user_id)
      console.log('✅ 用户名:', user.user_name)
      console.log('✅ 用户昵称:', user.user_nickname)
      console.log('✅ 真实姓名:', user.user_realname)
      console.log('✅ 性别:', user.user_gender)
      console.log('✅ 生日:', user.user_birthday)
      console.log('✅ 地址:', user.user_address)
    } else {
      console.log('❌ 用户未登录')
    }
  }, [user])

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('📋 获取商品分类...')
        const response = await fetch('http://localhost:3001/api/categories')
        const result = await response.json()
        
        if (result.success) {
          console.log('✅ 获取分类成功:', result.data)
          setCategories(result.data)
        } else {
          console.error('❌ 获取分类失败:', result.message)
        }
      } catch (error) {
        console.error('❌ 获取分类错误:', error)
      }
    }

    const fetchProducts = async () => {
      try {
        console.log('📦 获取商品列表...')
        const url = selectedCategory 
          ? `http://localhost:3001/api/products?categoryId=${selectedCategory}`
          : 'http://localhost:3001/api/products'
        
        const response = await fetch(url)
        const result = await response.json()
        
        if (result.success) {
          console.log('✅ 获取商品成功:', result.data)
          setProducts(result.data)
        } else {
          console.error('❌ 获取商品失败:', result.message)
        }
      } catch (error) {
        console.error('❌ 获取商品错误:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
    fetchProducts()
  }, [selectedCategory])

  const slides = [
    {
      id: 0,
      background: '#ff0036',
      title: '魅蓝note6',
      tag: '猩焰红 新上市',
      slogan: '我就是很红',
      price: '¥1299',
      spec: '3+32G',
      type: 'phone'
    },
    {
      id: 1,
      background: '#4caf50',
      title: '华为P30 Pro',
      tag: '极光色 限量版',
      slogan: '超感光徕卡四摄',
      price: '¥4999',
      spec: '8+128G',
      type: 'phone'
    },
    {
      id: 2,
      background: '#2196f3',
      title: '小米空气净化器',
      tag: '新品上市',
      slogan: '净化全家健康',
      price: '¥699',
      spec: 'Pro版',
      type: 'device'
    },
    {
      id: 3,
      background: '#9c27b0',
      title: '戴森吸尘器V11',
      tag: '智能升级',
      slogan: '深度清洁无死角',
      price: '¥3499',
      spec: '强劲版',
      type: 'device'
    },
    {
      id: 4,
      background: '#ff9800',
      title: '索尼WH-1000XM4',
      tag: '降噪旗舰',
      slogan: '静谧聆听体验',
      price: '¥1999',
      spec: '无线降噪',
      type: 'audio'
    }
  ]

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [slides.length])

  // 手动切换函数
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  // 处理立即购买
  const handleBuyNow = () => {
    const currentSlideData = slides[currentSlide]
    
    // 如果商品列表还在加载，提示用户稍等
    if (loading) {
      alert('商品信息正在加载中，请稍候...')
      return
    }
    
    // 根据轮播图中的商品名称，在商品列表中查找匹配的商品
    // 支持部分匹配，比如"魅蓝note6"可以匹配包含"魅蓝"或"note6"的商品
    const matchedProduct = products.find((product: any) => {
      const productName = product.product_name || ''
      const slideTitle = currentSlideData.title || ''
      
      // 尝试完全匹配
      if (productName.includes(slideTitle) || slideTitle.includes(productName)) {
        return true
      }
      
      // 尝试部分匹配（提取关键词）
      const slideKeywords = slideTitle.toLowerCase().split(/[\s\-]+/)
      const productNameLower = productName.toLowerCase()
      
      return slideKeywords.some(keyword => 
        keyword.length > 2 && productNameLower.includes(keyword)
      )
    })

    if (matchedProduct) {
      // 找到匹配的商品，跳转到商品详情页
      navigate(`/product/${matchedProduct.product_id}`)
    } else {
      // 没找到匹配的商品，根据商品类型跳转到对应的分类
      let categoryId = null
      
      // 根据商品类型映射到分类
      if (currentSlideData.type === 'phone') {
        // 手机类商品，查找"手机/数码/电脑办公"分类
        const phoneCategory = categories.find((cat: any) => 
          cat.category_name && cat.category_name.includes('手机')
        )
        if (phoneCategory) {
          categoryId = phoneCategory.category_id
        }
      } else if (currentSlideData.type === 'device') {
        // 设备类商品，查找"大家电/生活电器"分类
        const deviceCategory = categories.find((cat: any) => 
          cat.category_name && (cat.category_name.includes('电器') || cat.category_name.includes('家电'))
        )
        if (deviceCategory) {
          categoryId = deviceCategory.category_id
        }
      } else if (currentSlideData.type === 'audio') {
        // 音频类商品，查找"手机/数码/电脑办公"分类
        const audioCategory = categories.find((cat: any) => 
          cat.category_name && cat.category_name.includes('数码')
        )
        if (audioCategory) {
          categoryId = audioCategory.category_id
        }
      }
      
      if (categoryId) {
        // 跳转到对应分类的商品列表页
        navigate(`/category/${categoryId}`)
      } else {
        // 如果找不到对应分类，滚动到首页的商品列表区域
        window.scrollTo({ top: 1000, behavior: 'smooth' })
      }
    }
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
              <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} style={{ color: '#666', textDecoration: 'none' }}>退出</a>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#ff0036', textDecoration: 'none' }}>请登录</Link>
              <Link to="/register" style={{ color: '#666', textDecoration: 'none' }}>免费注册</Link>
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
          <div style={{
            width: '16px',
            height: '16px',
            background: '#ff0036',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '8px'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              background: '#fff',
              borderRadius: '1px'
            }}></div>
          </div>
        </div>
      </div>

      {/* 主头部区域 - 白色背景 */}
      <header style={{ padding: '16px 40px', background: '#fff', borderBottom: '2px solid #f0f0f0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto' }}>
          {/* 左侧：Logo和标语 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0, position: 'relative' }}>
            {/* 红色Tmall Logo */}
            <div style={{ fontSize: '28px', color: '#ff0036', fontWeight: 700, letterSpacing: '2px', lineHeight: '1' }}>
              TMALL
            </div>
            {/* 理想生活上天猫 */}
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
            {/* 搜索框下方的热门搜索词 */}
            <div style={{ 
              marginTop: '6px', 
              display: 'flex', 
              gap: '8px', 
              fontSize: '12px', 
              color: '#666',
              justifyContent: 'flex-start',
              width: '100%',
              maxWidth: '600px'
            }}>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>女装</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>男装</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>女鞋</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>美妆</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>腕表</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>手机</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>母婴玩具</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>零食</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>生鲜水果</a>
            </div>
          </div>
        </div>
      </header>

      {/* 二级导航栏 - 白色背景 */}
      <nav style={{ padding: '10px 40px', background: '#fff', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', gap: '24px' }}>
          {/* 天猫超市 - 绿色猫头图标 */}
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
          {/* 天猫国际 - 紫色猫头图标 */}
          <a href="#" style={{ color: '#333', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
            <div style={{
              width: '18px',
              height: '18px',
              background: '#9c27b0',
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
                  background: '#9c27b0',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '3px',
                  right: '2px',
                  width: '3px',
                  height: '3px',
                  background: '#9c27b0',
                  borderRadius: '50%'
                }}></div>
              </div>
            </div>
            <span>天猫国际</span>
          </a>
          {/* 其他链接 */}
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>天猫会员</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>电器城</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>喵鲜生</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>医药馆</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>营业厅</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>魅力惠</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>飞猪旅行</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>苏宁易购</a>
        </div>
      </nav>

      {/* 主要内容区域 - 分类菜单布局 */}
      <main style={{ 
        display: 'flex',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        minHeight: '400px'
      }}>
        {/* 左侧：分类菜单区域 */}
        <div style={{
          width: '180px',
          background: '#2c2c2c',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0
        }}>
          {/* 红色标题栏 */}
          <div style={{
            background: '#ff0036',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ color: '#fff', fontSize: '14px' }}>☰</span>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>商品分类</span>
          </div>
          {/* 分类列表 */}
          <div style={{ padding: '6px 0', background: '#2c2c2c' }}>
            {categories.length === 0 ? (
              <div style={{ padding: '12px', color: '#999', textAlign: 'center', fontSize: '12px' }}>
                加载中...
              </div>
            ) : (
              categories.map((category, index) => (
                <a
                  key={category.category_id || index}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(`/category/${category.category_id}`)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '12px',
                    transition: 'background 0.2s',
                    borderLeft: '3px solid transparent',
                    backgroundColor: selectedCategory === category.category_id ? 'rgba(255, 0, 54, 0.2)' : 'transparent',
                    borderLeftColor: selectedCategory === category.category_id ? '#ff0036' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category.category_id) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.borderLeftColor = '#ff0036'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category.category_id) {
                      e.currentTarget.style.background = selectedCategory === category.category_id ? 'rgba(255, 0, 54, 0.2)' : 'transparent'
                      e.currentTarget.style.borderLeftColor = selectedCategory === category.category_id ? '#ff0036' : 'transparent'
                    }
                  }}
                >
                  <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>{category.icon}</span>
                  <span>{category.category_name}</span>
                </a>
              ))
            )}
          </div>
        </div>

        {/* 右侧：内容区域 */}
        <div style={{ 
          flex: 1, 
          background: slides[currentSlide].background,
          position: 'relative',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '250px',
          transition: 'background 0.5s ease',
          backgroundImage: currentSlide === 0 ? 'linear-gradient(135deg, #ff0036 0%, #cc002b 100%)' :
                         currentSlide === 1 ? 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)' :
                         currentSlide === 2 ? 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)' :
                         currentSlide === 3 ? 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)' :
                         'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          backgroundBlend: 'multiply'
        }}>
          {/* 产品广告 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            width: '100%',
            maxWidth: '900px'
          }}>
            {/* 左侧：产品图片区域 */}
            <div style={{
              position: 'relative',
              width: '200px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {slides[currentSlide].type === 'phone' && (
                <>
                  {/* 前面的手机 */}
                  <div style={{
                    position: 'absolute',
                    left: '10px',
                    width: '100px',
                    height: '160px',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                    borderRadius: '15px',
                    border: '6px solid #fff',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    overflow: 'hidden'
                  }}>
                    {/* 手机屏幕内容 */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: slides[currentSlide].background,
                      borderRadius: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        fontSize: '14px',
                        fontWeight: 'normal'
                      }}>
                        18:30
                      </div>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}>
                        📱
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        fontSize: '12px',
                        fontWeight: 'normal'
                      }}>
                        {slides[currentSlide].tag.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                  {/* 后面的手机 */}
                  <div style={{
                    position: 'absolute',
                    right: '10px',
                    width: '100px',
                    height: '160px',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                    borderRadius: '15px',
                    border: '6px solid #fff',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                    transform: 'rotate(-8deg)',
                    zIndex: 1
                  }}>
                    {/* 手机背面设计 */}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {/* 双摄像头 */}
                      <div style={{
                        display: 'flex',
                        gap: '4px',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          background: '#000',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div style={{
                            width: '10px',
                            height: '10px',
                            background: '#333',
                            borderRadius: '50%'
                          }}></div>
                        </div>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          background: '#000',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div style={{
                            width: '10px',
                            height: '10px',
                            background: '#333',
                            borderRadius: '50%'
                          }}></div>
                        </div>
                      </div>
                      {/* 指纹传感器 */}
                      <div style={{
                        width: '28px',
                        height: '28px',
                        background: '#000',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px'
                      }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          background: '#333',
                          borderRadius: '50%',
                          border: '2px solid #555'
                        }}></div>
                      </div>
                    </div>
                    {/* 品牌标识 */}
                    <div style={{
                      position: 'absolute',
                      bottom: '15px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '10px',
                      color: '#666',
                      fontWeight: 'bold'
                    }}>
                      {slides[currentSlide].title.includes('魅蓝') ? 'MEIZU' : 'HUAWEI'}
                    </div>
                  </div>
                </>
              )}
              
              {slides[currentSlide].type === 'device' && (
                <>
                  {/* 前面的设备 */}
                  <div style={{
                    position: 'absolute',
                    left: '10px',
                    width: '130px',
                    height: '130px',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                    borderRadius: '15px',
                    border: '6px solid #fff',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    transform: 'rotate(5deg)'
                  }}>
                    <div style={{
                      fontSize: '60px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      {slides[currentSlide].title.includes('净化器') ? '🌬️' : '💨'}
                    </div>
                  </div>
                  {/* 后面的设备 */}
                  <div style={{
                    position: 'absolute',
                    right: '10px',
                    width: '130px',
                    height: '130px',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                    borderRadius: '15px',
                    border: '6px solid #fff',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                    transform: 'rotate(-5deg)'
                  }}>
                    <div style={{
                      fontSize: '60px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      {slides[currentSlide].title.includes('净化器') ? '💨' : '🌬️'}
                    </div>
                  </div>
                </>
              )}
              
              {slides[currentSlide].type === 'audio' && (
                <>
                  {/* 前面的耳机 */}
                  <div style={{
                    position: 'absolute',
                    left: '10px',
                    width: '120px',
                    height: '150px',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                    borderRadius: '60px',
                    border: '6px solid #fff',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    transform: 'rotate(8deg)'
                  }}>
                    <div style={{
                      fontSize: '70px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      🎧
                    </div>
                  </div>
                  {/* 后面的耳机 */}
                  <div style={{
                    position: 'absolute',
                    right: '10px',
                    width: '120px',
                    height: '150px',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                    borderRadius: '60px',
                    border: '6px solid #fff',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                    transform: 'rotate(-8deg)'
                  }}>
                    <div style={{
                      fontSize: '70px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      🎧
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 右侧：产品信息 */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              color: '#fff',
              marginLeft: '10px'
            }}>
              {/* 产品名称 */}
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                lineHeight: '1.2',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                letterSpacing: '1px'
              }}>
                {slides[currentSlide].title}
              </div>

              {/* 标签 */}
              <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}>
                <div style={{
                  padding: '6px 16px',
                  border: '3px solid #fff',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(4px)'
                }}>
                  {slides[currentSlide].tag}
                </div>
              </div>

              {/* 宣传语 */}
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginTop: '5px',
                textShadow: '0 2px 6px rgba(0,0,0,0.4)',
                lineHeight: '1.3'
              }}>
                {slides[currentSlide].slogan}
              </div>

              {/* 价格和规格 */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '15px',
                marginTop: '8px'
              }}>
                <span style={{
                  fontSize: '42px',
                  fontWeight: 'bold',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                  {slides[currentSlide].price}
                </span>
                <div style={{
                  padding: '6px 16px',
                  border: '3px solid #fff',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(4px)'
                }}>
                  {slides[currentSlide].spec}
                </div>
              </div>

              {/* 购买按钮 */}
              <button 
                onClick={handleBuyNow}
                style={{
                  marginTop: '15px',
                  padding: '12px 32px',
                  background: 'rgba(255,255,255,0.9)',
                  color: slides[currentSlide].background,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: 'fit-content',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)'
                  e.currentTarget.style.background = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.9)'
                }}
              >
                立即抢购
              </button>
            </div>
          </div>

          {/* 左侧切换按钮 */}
          <button
            onClick={goToPrevSlide}
            style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '45px',
              height: '45px',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s',
              zIndex: 10,
              fontSize: '20px',
              color: slides[currentSlide].background,
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.9)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            ◀
          </button>

          {/* 右侧切换按钮 */}
          <button
            onClick={goToNextSlide}
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '45px',
              height: '45px',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s',
              zIndex: 10,
              fontSize: '20px',
              color: slides[currentSlide].background,
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.9)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            ▶
          </button>

          {/* 轮播指示器 */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '20px',
            backdropFilter: 'blur(8px)',
            zIndex: 5
          }}>
            {slides.map((_, index) => (
              <div
                key={index}
                style={{
                  width: index === currentSlide ? '28px' : '8px',
                  height: '6px',
                  background: index === currentSlide ? '#fff' : 'rgba(255,255,255,0.6)',
                  borderRadius: '3px',
                  transition: 'all 0.4s',
                  cursor: 'pointer',
                  boxShadow: index === currentSlide ? '0 2px 8px rgba(255,255,255,0.4)' : 'none'
                }}
                onClick={() => goToSlide(index)}
              ></div>
            ))}
          </div>
        </div>


      </main>
    </div>
  )
}

