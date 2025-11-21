// 简化版后端服务器 - 包含商品分类和商品API
console.log('🚀 启动天猫后端服务器...');

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 分类数据（包含图标）
const categoriesData = [
  { category_id: 1, category_name: '女装/大衣', icon: '👗' },
  { category_id: 2, category_name: '男装/运动户外', icon: '👔' },
  { category_id: 3, category_name: '女鞋/男鞋/箱包', icon: '👠' },
  { category_id: 4, category_name: '美妆/个人护理', icon: '💄' },
  { category_id: 5, category_name: '腕表/眼镜/珠宝饰品', icon: '⌚' },
  { category_id: 6, category_name: '手机/数码/电脑办公', icon: '📱' },
  { category_id: 7, category_name: '母婴玩具', icon: '👶' },
  { category_id: 8, category_name: '零食/茶酒/进口食品', icon: '🍫' },
  { category_id: 9, category_name: '生鲜水果', icon: '🍎' },
  { category_id: 10, category_name: '大家电/生活电器', icon: '📺' }
];

// 商品数据
const productsData = [
  // 女装/大衣 (category_id: 1)
  { product_id: 1, product_name: '优雅女士羊毛大衣', product_title: '2024新款优雅女士羊毛大衣', product_price: 399.00, product_sale_price: 299.00, product_category_id: 1, product_is_enabled: 1 },
  { product_id: 2, product_name: '时尚女士羽绒服', product_title: '保暖时尚女士羽绒服', product_price: 599.00, product_sale_price: 399.00, product_category_id: 1, product_is_enabled: 1 },
  { product_id: 3, product_name: '韩版女士连衣裙', product_title: '春季新款韩版女士连衣裙', product_price: 199.00, product_sale_price: 129.00, product_category_id: 1, product_is_enabled: 1 },
  { product_id: 4, product_name: '女士针织衫', product_title: '舒适女士针织衫', product_price: 159.00, product_sale_price: 99.00, product_category_id: 1, product_is_enabled: 1 },
  { product_id: 5, product_name: '女士风衣外套', product_title: '春秋季女士风衣外套', product_price: 359.00, product_sale_price: 259.00, product_category_id: 1, product_is_enabled: 1 },
  { product_id: 6, product_name: '女士毛呢大衣', product_title: '冬季保暖女士毛呢大衣', product_price: 499.00, product_sale_price: 349.00, product_category_id: 1, product_is_enabled: 1 },
  { product_id: 7, product_name: '女士休闲卫衣', product_title: '舒适女士休闲卫衣', product_price: 129.00, product_sale_price: 89.00, product_category_id: 1, product_is_enabled: 1 },
  { product_id: 8, product_name: '女士西装外套', product_title: '职场女士西装外套', product_price: 299.00, product_sale_price: 199.00, product_category_id: 1, product_is_enabled: 1 },
  
  // 男装/运动户外 (category_id: 2)
  { product_id: 9, product_name: '商务男士西装', product_title: '高端商务男士西装套装', product_price: 899.00, product_sale_price: 599.00, product_category_id: 2, product_is_enabled: 1 },
  { product_id: 10, product_name: '男士运动外套', product_title: '透气男士运动外套', product_price: 299.00, product_sale_price: 199.00, product_category_id: 2, product_is_enabled: 1 },
  { product_id: 11, product_name: '休闲男士牛仔裤', product_title: '经典版型男士牛仔裤', product_price: 199.00, product_sale_price: 129.00, product_category_id: 2, product_is_enabled: 1 },
  { product_id: 12, product_name: '户外冲锋衣', product_title: '防水透气户外冲锋衣', product_price: 499.00, product_sale_price: 399.00, product_category_id: 2, product_is_enabled: 1 },
  { product_id: 13, product_name: '男士夹克外套', product_title: '春秋季男士夹克外套', product_price: 329.00, product_sale_price: 229.00, product_category_id: 2, product_is_enabled: 1 },
  { product_id: 14, product_name: '男士运动裤', product_title: '舒适男士运动裤', product_price: 159.00, product_sale_price: 109.00, product_category_id: 2, product_is_enabled: 1 },
  { product_id: 15, product_name: '男士羽绒服', product_title: '冬季保暖男士羽绒服', product_price: 699.00, product_sale_price: 499.00, product_category_id: 2, product_is_enabled: 1 },
  { product_id: 16, product_name: '男士休闲衬衫', product_title: '商务休闲男士衬衫', product_price: 189.00, product_sale_price: 129.00, product_category_id: 2, product_is_enabled: 1 }
];

// API接口

// 获取所有分类
app.get('/api/categories', (req, res) => {
  try {
    console.log('📋 获取商品分类...');
    res.json({
      success: true,
      message: '获取分类成功',
      data: categoriesData
    });
  } catch (error) {
    console.error('❌ 获取分类错误:', error);
    res.status(500).json({
      success: false,
      message: '获取分类失败',
      error: error.message
    });
  }
});

// 获取商品列表（支持按分类筛选）
app.get('/api/products', (req, res) => {
  try {
    const { categoryId } = req.query;
    console.log('📦 获取商品列表，分类ID:', categoryId);
    
    let filteredProducts = productsData;
    
    if (categoryId) {
      filteredProducts = productsData.filter(product => 
        product.product_category_id.toString() === categoryId
      );
    }
    
    console.log('✅ 返回商品数量:', filteredProducts.length);
    
    res.json({
      success: true,
      message: '获取商品成功',
      data: filteredProducts
    });
  } catch (error) {
    console.error('❌ 获取商品错误:', error);
    res.status(500).json({
      success: false,
      message: '获取商品失败',
      error: error.message
    });
  }
});

// 测试接口
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: '天猫后端服务器运行正常',
    time: new Date().toISOString(),
    productCount: productsData.length,
    categoryCount: categoriesData.length
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('');
  console.log('🎉 天猫后端服务器启动成功!');
  console.log('📍 端口:', PORT);
  console.log('🌐 API地址: http://localhost:' + PORT + '/api');
  console.log('📊 商品数量:', productsData.length);
  console.log('📋 分类数量:', categoriesData.length);
  console.log('');
});