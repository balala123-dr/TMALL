// 为数据库添加示例商品数据的脚本
// 请在Node.js环境中运行此脚本

console.log('正在添加示例商品数据...')

// 由于直接操作Supabase需要认证信息，这里提供一个替代方案：
// 1. 使用Supabase仪表盘手动添加数据
// 2. 或者修改后端API在缺少数据时返回模拟数据

const sampleProducts = [
  // 女装/大衣分类的商品
  {
    product_name: "优雅女士羊毛大衣",
    product_title: "经典款式，优雅大气",
    product_price: 599.00,
    product_sale_price: 399.00,
    product_category_id: 1,
    product_description: "优质羊毛面料，保暖舒适，优雅大气的款式",
    product_is_enabled: 1
  },
  {
    product_name: "时尚女士羽绒服",
    product_title: "轻薄保暖，时尚百搭",
    product_price: 799.00,
    product_sale_price: 599.00,
    product_category_id: 1,
    product_description: "轻盈保暖，时尚设计，适合秋冬穿着",
    product_is_enabled: 1
  },
  {
    product_name: "韩版女士连衣裙",
    product_title: "甜美可爱，修身显瘦",
    product_price: 299.00,
    product_sale_price: 199.00,
    product_category_id: 1,
    product_description: "韩版设计，修身剪裁，展现女性优美曲线",
    product_is_enabled: 1
  },
  
  // 汽车配件分类的商品 (category_id: 10)
  {
    product_name: "汽车防水车衣",
    product_title: "全方位保护，防尘防雨",
    product_price: 199.00,
    product_sale_price: 129.00,
    product_category_id: 10,
    product_description: "高品质防水材质，全方位保护车漆，防尘防雨防晒",
    product_is_enabled: 1
  },
  {
    product_name: "车载手机支架",
    product_title: "稳固不晃，安全驾驶",
    product_price: 69.00,
    product_sale_price: 49.00,
    product_category_id: 10,
    product_description: "稳固不晃动，适合各种车型，安全驾驶必备",
    product_is_enabled: 1
  },
  {
    product_name: "汽车座椅套",
    product_title: "四季通用，舒适透气",
    product_price: 299.00,
    product_sale_price: 199.00,
    product_category_id: 10,
    product_description: "高品质面料，四季通用，安装简便，舒适透气",
    product_is_enabled: 1
  },
  
  // 医药保健分类的商品 (category_id: 11)
  {
    product_name: "维生素C片",
    product_title: "增强免疫力，健康保障",
    product_price: 89.00,
    product_sale_price: 69.00,
    product_category_id: 11,
    product_description: "高浓度维生素C，增强免疫力，促进健康",
    product_is_enabled: 1
  },
  {
    product_name: "电子血压计",
    product_title: "精准测量，家用必备",
    product_price: 299.00,
    product_sale_price: 199.00,
    product_category_id: 11,
    product_description: "精准测量，大屏幕显示，家用健康监测必备",
    product_is_enabled: 1
  },
  {
    product_name: "颈椎按摩器",
    product_title: "缓解疲劳，舒适放松",
    product_price: 199.00,
    product_sale_price: 149.00,
    product_category_id: 11,
    product_description: "多档位调节，深层按摩，有效缓解颈椎疲劳",
    product_is_enabled: 1
  },
  
  // 家纺/家饰/鲜花分类的商品 (category_id: 13)
  {
    product_name: "纯棉四件套",
    product_title: "亲肤舒适，睡眠质量佳",
    product_price: 299.00,
    product_sale_price: 199.00,
    product_category_id: 13,
    product_description: "100%纯棉材质，亲肤透气，提高睡眠质量",
    product_is_enabled: 1
  },
  {
    product_name: "记忆枕",
    product_title: "人体工学设计，呵护颈椎",
    product_price: 159.00,
    product_sale_price: 99.00,
    product_category_id: 13,
    product_description: "记忆棉材质，人体工学设计，有效呵护颈椎",
    product_is_enabled: 1
  },
  {
    product_name: "真丝眼罩",
    product_title: "遮光助眠，舒适透气",
    product_price: 69.00,
    product_sale_price: 49.00,
    product_category_id: 13,
    product_description: "真丝材质，柔软透气，有效遮光，提高睡眠质量",
    product_is_enabled: 1
  }
]

console.log('示例商品数据已准备好')
console.log('您可以复制以下SQL语句到Supabase仪表盘中执行：')

// 生成SQL插入语句
let sql = '-- 添加示例商品数据\n'
sampleProducts.forEach(product => {
  sql += `INSERT INTO product (product_name, product_title, product_price, product_sale_price, product_category_id, product_description, product_is_enabled, product_create_date) VALUES ('${product.product_name}', '${product.product_title}', ${product.product_price}, ${product.product_sale_price}, ${product.product_category_id}, '${product.product_description}', ${product.product_is_enabled}, NOW());\n`
})

console.log(sql)

// 生成商品图片数据
console.log('\n-- 为商品添加图片数据\n')
let imageSql = ''
sampleProducts.forEach((product, index) => {
  const imageId = index + 1
  imageSql += `INSERT INTO product_image (product_image_product_id, product_image_src) VALUES ((SELECT product_id FROM product WHERE product_name = '${product.product_name}'), 'https://picsum.photos/seed/${product.product_name}/240/200.jpg');\n`
})

console.log(imageSql)
console.log('\n请在Supabase仪表盘中执行以上SQL语句，或者使用以下API查看所有商品：')
console.log('GET http://localhost:3001/api/products')