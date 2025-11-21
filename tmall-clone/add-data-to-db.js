// 直接向Supabase数据库添加商品数据的脚本

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// 读取.env文件
function loadEnv() {
  const envPath = path.join(__dirname, '.env')
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envVars = {}
  
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=')
    if (key && values.length > 0) {
      envVars[key.trim()] = values.join('=').trim()
    }
  })
  
  return envVars
}

const env = loadEnv()
const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 找不到Supabase配置，请检查.env文件')
  process.exit(1)
}

console.log('✅ 连接到Supabase数据库...')
const supabase = createClient(supabaseUrl, supabaseKey)

// 按分类准备商品数据
const productsByCategory = [
  // 分类1: 女装/大衣
  {
    category_id: 1,
    products: [
      {
        product_name: '优雅女士羊毛大衣',
        product_title: '经典款式，优雅大气',
        product_price: 599.00,
        product_sale_price: 399.00,
        product_description: '优质羊毛面料，保暖舒适，优雅大气的款式',
        product_is_enabled: 1
      },
      {
        product_name: '时尚女士羽绒服',
        product_title: '轻薄保暖，时尚百搭',
        product_price: 799.00,
        product_sale_price: 599.00,
        product_description: '轻盈保暖，时尚设计，适合秋冬穿着',
        product_is_enabled: 1
      },
      {
        product_name: '韩版女士连衣裙',
        product_title: '甜美可爱，修身显瘦',
        product_price: 299.00,
        product_sale_price: 199.00,
        product_description: '韩版设计，修身剪裁，展现女性优美曲线',
        product_is_enabled: 1
      }
    ]
  },
  
  // 分类10: 汽车/配件/用品
  {
    category_id: 10,
    products: [
      {
        product_name: '汽车防水车衣',
        product_title: '全方位保护，防尘防雨',
        product_price: 199.00,
        product_sale_price: 129.00,
        product_description: '高品质防水材质，全方位保护车漆，防尘防雨防晒',
        product_is_enabled: 1
      },
      {
        product_name: '车载手机支架',
        product_title: '稳固不晃，安全驾驶',
        product_price: 69.00,
        product_sale_price: 49.00,
        product_description: '稳固不晃动，适合各种车型，安全驾驶必备',
        product_is_enabled: 1
      },
      {
        product_name: '汽车座椅套',
        product_title: '四季通用，舒适透气',
        product_price: 299.00,
        product_sale_price: 199.00,
        product_description: '高品质面料，四季通用，安装简便，舒适透气',
        product_is_enabled: 1
      }
    ]
  },
  
  // 分类11: 医药保健
  {
    category_id: 11,
    products: [
      {
        product_name: '维生素C片',
        product_title: '增强免疫力，健康保障',
        product_price: 89.00,
        product_sale_price: 69.00,
        product_description: '高浓度维生素C，增强免疫力，促进健康',
        product_is_enabled: 1
      },
      {
        product_name: '电子血压计',
        product_title: '精准测量，家用必备',
        product_price: 299.00,
        product_sale_price: 199.00,
        product_description: '精准测量，大屏幕显示，家用健康监测必备',
        product_is_enabled: 1
      },
      {
        product_name: '颈椎按摩器',
        product_title: '缓解疲劳，舒适放松',
        product_price: 199.00,
        product_sale_price: 149.00,
        product_description: '多档位调节，深层按摩，有效缓解颈椎疲劳',
        product_is_enabled: 1
      }
    ]
  },
  
  // 分类13: 家纺/家饰/鲜花
  {
    category_id: 13,
    products: [
      {
        product_name: '纯棉四件套',
        product_title: '亲肤舒适，睡眠质量佳',
        product_price: 299.00,
        product_sale_price: 199.00,
        product_description: '100%纯棉材质，亲肤透气，提高睡眠质量',
        product_is_enabled: 1
      },
      {
        product_name: '记忆枕',
        product_title: '人体工学设计，呵护颈椎',
        product_price: 159.00,
        product_sale_price: 99.00,
        product_description: '记忆棉材质，人体工学设计，有效呵护颈椎',
        product_is_enabled: 1
      },
      {
        product_name: '真丝眼罩',
        product_title: '遮光助眠，舒适透气',
        product_price: 69.00,
        product_sale_price: 49.00,
        product_description: '真丝材质，柔软透气，有效遮光，提高睡眠质量',
        product_is_enabled: 1
      }
    ]
  }
]

// 添加商品到数据库
async function addProductsToDatabase() {
  try {
    console.log('📦 开始向数据库添加商品数据...')
    
    for (const category of productsByCategory) {
      console.log(`\n📋 处理分类 ${category.category_id}...`)
      
      for (const product of category.products) {
        // 添加商品
        const { data: productData, error: productError } = await supabase
          .from('product')
          .insert({
            ...product,
            product_category_id: category.category_id,
            product_create_date: new Date().toISOString()
          })
          .select()
        
        if (productError) {
          console.error(`❌ 添加商品失败: ${product.product_name}`, productError)
          continue
        }
        
        const newProductId = productData[0].product_id
        console.log(`✅ 添加商品成功: ${product.product_name} (ID: ${newProductId})`)
        
        // 为商品添加图片
        const { data: imageData, error: imageError } = await supabase
          .from('product_image')
          .insert({
            product_image_product_id: newProductId,
            product_image_src: `https://picsum.photos/seed/${newProductId}-${encodeURIComponent(product.product_name)}/240/200.jpg`
          })
          .select()
        
        if (imageError) {
          console.error(`❌ 添加商品图片失败: ${product.product_name}`, imageError)
        } else {
          console.log(`✅ 添加商品图片成功: ${product.product_name}`)
        }
      }
    }
    
    console.log('\n🎉 所有商品数据添加完成！')
    console.log('现在可以刷新前端页面查看商品了')
  } catch (error) {
    console.error('❌ 添加商品数据出错:', error)
  }
}

// 执行添加操作
addProductsToDatabase()