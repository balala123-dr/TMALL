const { getSupabaseClient, createResponse } = require('./_utils/supabase')

// 默认商品图片映射
const defaultProductImageMap = {
  '优雅女士羊毛大衣': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  '时尚女士羽绒服': 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80',
  '韩版女士连衣裙': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
  '女士针织衫': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
  '女士风衣外套': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80',
  '女士毛呢大衣': 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=600&q=80',
  '女士休闲卫衣': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
  '女士西装外套': 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=600&q=80'
}

const defaultCategoryImageMap = {
  '女装/大衣': [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
  ],
  '男装/运动户外': [
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=600&q=80'
  ]
}

const genericFallbackImages = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80'
]

function resolveProductImages(product, fetchedImages, categoryName) {
  const sanitizedImages = (fetchedImages || []).filter(img => !!img?.product_image_src)
  if (sanitizedImages.length > 0) {
    return sanitizedImages
  }

  const trimmedName = product.product_name ? product.product_name.trim() : ''
  if (trimmedName && defaultProductImageMap[trimmedName]) {
    return [{ product_image_src: defaultProductImageMap[trimmedName] }]
  }

  if (categoryName && defaultCategoryImageMap[categoryName] && defaultCategoryImageMap[categoryName].length > 0) {
    const pool = defaultCategoryImageMap[categoryName]
    const poolIndex = product.product_id % pool.length
    return [{ product_image_src: pool[poolIndex] }]
  }

  const fallbackIndex = product.product_id % genericFallbackImages.length
  const fallback = genericFallbackImages[fallbackIndex]
  const separator = fallback.includes('?') ? '&' : '?'
  return [{
    product_image_src: `${fallback}${separator}sig=${product.product_id}`
  }]
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
    console.log('📦 获取商品列表...')
    const supabase = getSupabaseClient()

    // 获取分类ID参数
    const categoryId = event.queryStringParameters?.categoryId

    let query = supabase
      .from('product')
      .select('*')
      .eq('product_is_enabled', 1)

    // 如果有分类ID，则过滤
    if (categoryId) {
      query = query.eq('product_category_id', categoryId)
    }

    const { data, error } = await query.order('product_create_date', { ascending: false })

    if (error) throw error

    // 获取分类映射
    const { data: categoryRows } = await supabase
      .from('category')
      .select('category_id, category_name')

    const categoryMap = new Map()
    if (categoryRows && Array.isArray(categoryRows)) {
      categoryRows.forEach(cat => {
        if (cat?.category_id) {
          categoryMap.set(cat.category_id, cat.category_name)
        }
      })
    }

    // 获取每个商品的图片
    const productsWithImages = await Promise.all(data.map(async (product) => {
      const { data: images } = await supabase
        .from('product_image')
        .select('product_image_src')
        .eq('product_image_product_id', product.product_id)

      return {
        ...product,
        product_images: resolveProductImages(
          product,
          images || [],
          categoryMap.get(product.product_category_id)
        )
      }
    }))

    console.log('✅ 获取商品成功:', productsWithImages.length, '个商品')
    return createResponse(200, {
      success: true,
      message: '获取商品成功',
      data: productsWithImages
    })
  } catch (error) {
    console.error('❌ 获取商品错误:', error)
    return createResponse(500, {
      success: false,
      message: '获取商品失败',
      error: error.message
    })
  }
}

