// 初始化商品分类和商品数据
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

const supabase = createClient(supabaseUrl, supabaseKey)

// 初始化分类数据
const categories = [
  { category_name: '女装/大衣', category_image_src: '/images/categories/women-clothing.jpg' },
  { category_name: '男装/运动户外', category_image_src: '/images/categories/men-clothing.jpg' },
  { category_name: '女鞋/男鞋/箱包', category_image_src: '/images/categories/shoes-bags.jpg' },
  { category_name: '美妆/个人护理', category_image_src: '/images/categories/beauty.jpg' },
  { category_name: '腕表/眼镜/珠宝饰品', category_image_src: '/images/categories/jewelry.jpg' },
  { category_name: '手机/数码/电脑办公', category_image_src: '/images/categories/phones.jpg' },
  { category_name: '母婴玩具', category_image_src: '/images/categories/baby.jpg' },
  { category_name: '零食/茶酒/进口食品', category_image_src: '/images/categories/food.jpg' },
  { category_name: '生鲜水果', category_image_src: '/images/categories/fresh.jpg' },
  { category_name: '大家电/生活电器', category_image_src: '/images/categories/appliances.jpg' },
  { category_name: '家居建材', category_image_src: '/images/categories/home.jpg' },
  { category_name: '汽车/配件/用品', category_image_src: '/images/categories/car.jpg' },
  { category_name: '家纺/家饰/鲜花', category_image_src: '/images/categories/textiles.jpg' },
  { category_name: '医药保健', category_image_src: '/images/categories/health.jpg' },
  { category_name: '厨具/收纳/宠物', category_image_src: '/images/categories/kitchen.jpg' },
  { category_name: '图书音像', category_image_src: '/images/categories/books.jpg' }
]

// 初始化商品数据
const products = [
  // 女装/大衣 (category_id: 1)
  { product_name: '优雅女士羊毛大衣', product_title: '2024新款优雅女士羊毛大衣', product_price: 399.00, product_sale_price: 299.00, product_category_id: 1, product_is_enabled: 1, product_image_src: '/images/products/women-coat-1.jpg' },
  { product_name: '时尚女士羽绒服', product_title: '保暖时尚女士羽绒服', product_price: 599.00, product_sale_price: 399.00, product_category_id: 1, product_is_enabled: 1, product_image_src: '/images/products/women-down-jacket-1.jpg' },
  { product_name: '韩版女士连衣裙', product_title: '春季新款韩版女士连衣裙', product_price: 199.00, product_sale_price: 129.00, product_category_id: 1, product_is_enabled: 1, product_image_src: '/images/products/women-dress-1.jpg' },
  { product_name: '女士针织衫', product_title: '舒适女士针织衫', product_price: 159.00, product_sale_price: 99.00, product_category_id: 1, product_is_enabled: 1, product_image_src: '/images/products/women-knitwear-1.jpg' },
  { product_name: '女士风衣外套', product_title: '春秋季女士风衣外套', product_price: 359.00, product_sale_price: 259.00, product_category_id: 1, product_is_enabled: 1, product_image_src: '/images/products/women-trench-coat-1.jpg' },
  { product_name: '女士毛呢大衣', product_title: '冬季保暖女士毛呢大衣', product_price: 499.00, product_sale_price: 349.00, product_category_id: 1, product_is_enabled: 1, product_image_src: '/images/products/women-wool-coat-1.jpg' },
  { product_name: '女士休闲卫衣', product_title: '舒适女士休闲卫衣', product_price: 129.00, product_sale_price: 89.00, product_category_id: 1, product_is_enabled: 1, product_image_src: '/images/products/women-sweatshirt-1.jpg' },
  { product_name: '女士西装外套', product_title: '职场女士西装外套', product_price: 299.00, product_sale_price: 199.00, product_category_id: 1, product_is_enabled: 1, product_image_src: '/images/products/women-blazer-1.jpg' },
  
  // 男装/运动户外 (category_id: 2)
  { product_name: '商务男士西装', product_title: '高端商务男士西装套装', product_price: 899.00, product_sale_price: 599.00, product_category_id: 2, product_is_enabled: 1 },
  { product_name: '男士运动外套', product_title: '透气男士运动外套', product_price: 299.00, product_sale_price: 199.00, product_category_id: 2, product_is_enabled: 1 },
  { product_name: '休闲男士牛仔裤', product_title: '经典版型男士牛仔裤', product_price: 199.00, product_sale_price: 129.00, product_category_id: 2, product_is_enabled: 1 },
  { product_name: '户外冲锋衣', product_title: '防水透气户外冲锋衣', product_price: 499.00, product_sale_price: 399.00, product_category_id: 2, product_is_enabled: 1 },
  { product_name: '男士夹克外套', product_title: '春秋季男士夹克外套', product_price: 329.00, product_sale_price: 229.00, product_category_id: 2, product_is_enabled: 1 },
  { product_name: '男士运动裤', product_title: '舒适男士运动裤', product_price: 159.00, product_sale_price: 109.00, product_category_id: 2, product_is_enabled: 1 },
  { product_name: '男士羽绒服', product_title: '冬季保暖男士羽绒服', product_price: 699.00, product_sale_price: 499.00, product_category_id: 2, product_is_enabled: 1 },
  { product_name: '男士休闲衬衫', product_title: '商务休闲男士衬衫', product_price: 189.00, product_sale_price: 129.00, product_category_id: 2, product_is_enabled: 1 },
  
  // 女鞋/男鞋/箱包 (category_id: 3)
  { product_name: '时尚女士高跟鞋', product_title: '优雅女士高跟鞋', product_price: 299.00, product_sale_price: 199.00, product_category_id: 3, product_is_enabled: 1 },
  { product_name: '舒适男士皮鞋', product_title: '商务男士皮鞋', product_price: 399.00, product_sale_price: 299.00, product_category_id: 3, product_is_enabled: 1 },
  { product_name: '时尚女士手提包', product_title: '优质女士手提包', product_price: 199.00, product_sale_price: 129.00, product_category_id: 3, product_is_enabled: 1 },
  { product_name: '男士商务背包', product_title: '大容量男士商务背包', product_price: 249.00, product_sale_price: 179.00, product_category_id: 3, product_is_enabled: 1 },
  { product_name: '女士平底鞋', product_title: '舒适女士平底鞋', product_price: 159.00, product_sale_price: 109.00, product_category_id: 3, product_is_enabled: 1 },
  { product_name: '男士运动鞋', product_title: '透气男士运动鞋', product_price: 299.00, product_sale_price: 199.00, product_category_id: 3, product_is_enabled: 1 },
  { product_name: '女士单肩包', product_title: '时尚女士单肩包', product_price: 229.00, product_sale_price: 159.00, product_category_id: 3, product_is_enabled: 1 },
  { product_name: '旅行箱', product_title: '20寸轻便旅行箱', product_price: 399.00, product_sale_price: 299.00, product_category_id: 3, product_is_enabled: 1 },
  
  // 美妆/个人护理 (category_id: 4)
  { product_name: '保湿面霜', product_title: '深层保湿面霜50ml', product_price: 199.00, product_sale_price: 129.00, product_category_id: 4, product_is_enabled: 1 },
  { product_name: '防晒喷雾', product_title: '清爽防晒喷雾150ml', product_price: 99.00, product_sale_price: 59.00, product_category_id: 4, product_is_enabled: 1 },
  { product_name: '口红套装', product_title: '经典色号口红套装', product_price: 299.00, product_sale_price: 199.00, product_category_id: 4, product_is_enabled: 1 },
  { product_name: '洁面乳', product_title: '温和洁面乳100ml', product_price: 79.00, product_sale_price: 49.00, product_category_id: 4, product_is_enabled: 1 },
  { product_name: '眼影盘', product_title: '12色眼影盘', product_price: 159.00, product_sale_price: 99.00, product_category_id: 4, product_is_enabled: 1 },
  { product_name: '男士洗面奶', product_title: '控油男士洗面奶', product_price: 69.00, product_sale_price: 49.00, product_category_id: 4, product_is_enabled: 1 },
  { product_name: '精华液', product_title: '抗皱精华液30ml', product_price: 299.00, product_sale_price: 199.00, product_category_id: 4, product_is_enabled: 1 },
  { product_name: '护发精油', product_title: '修复护发精油100ml', product_price: 89.00, product_sale_price: 59.00, product_category_id: 4, product_is_enabled: 1 },
  
  // 腕表/眼镜/珠宝饰品 (category_id: 5)
  { product_name: '时尚女士手表', product_title: '精致女士手表', product_price: 599.00, product_sale_price: 399.00, product_category_id: 5, product_is_enabled: 1 },
  { product_name: '商务男士手表', product_title: '经典商务男士手表', product_price: 799.00, product_sale_price: 599.00, product_category_id: 5, product_is_enabled: 1 },
  { product_name: '太阳镜', product_title: '时尚偏光太阳镜', product_price: 299.00, product_sale_price: 199.00, product_category_id: 5, product_is_enabled: 1 },
  { product_name: '925银项链', product_title: '精致925银项链', product_price: 399.00, product_sale_price: 299.00, product_category_id: 5, product_is_enabled: 1 },
  { product_name: '智能手表', product_title: '多功能智能手表', product_price: 899.00, product_sale_price: 699.00, product_category_id: 5, product_is_enabled: 1 },
  { product_name: '金戒指', product_title: '18K金戒指', product_price: 1299.00, product_sale_price: 999.00, product_category_id: 5, product_is_enabled: 1 },
  { product_name: '光学眼镜', product_title: '防蓝光光学眼镜', product_price: 399.00, product_sale_price: 299.00, product_category_id: 5, product_is_enabled: 1 },
  { product_name: '珍珠耳环', product_title: '天然珍珠耳环', product_price: 599.00, product_sale_price: 399.00, product_category_id: 5, product_is_enabled: 1 },
  
  // 手机/数码/电脑办公 (category_id: 6)
  { product_name: '智能手机', product_title: '5G智能手机128G', product_price: 2999.00, product_sale_price: 2499.00, product_category_id: 6, product_is_enabled: 1 },
  { product_name: '笔记本电脑', product_title: '轻薄笔记本电脑', product_price: 4999.00, product_sale_price: 3999.00, product_category_id: 6, product_is_enabled: 1 },
  { product_name: '无线耳机', product_title: '降噪无线耳机', product_price: 599.00, product_sale_price: 399.00, product_category_id: 6, product_is_enabled: 1 },
  { product_name: '智能手环', product_title: '多功能智能手环', product_price: 299.00, product_sale_price: 199.00, product_category_id: 6, product_is_enabled: 1 },
  { product_name: '平板电脑', product_title: '10寸平板电脑', product_price: 1999.00, product_sale_price: 1499.00, product_category_id: 6, product_is_enabled: 1 },
  { product_name: '数码相机', product_title: '入门级数码相机', product_price: 2999.00, product_sale_price: 2299.00, product_category_id: 6, product_is_enabled: 1 },
  { product_name: '游戏鼠标', product_title: '电竞游戏鼠标', product_price: 199.00, product_sale_price: 129.00, product_category_id: 6, product_is_enabled: 1 },
  { product_name: '机械键盘', product_title: 'RGB机械键盘', product_price: 399.00, product_sale_price: 299.00, product_category_id: 6, product_is_enabled: 1 },
  
  // 母婴玩具 (category_id: 7)
  { product_name: '婴儿奶粉', product_title: '优质婴儿奶粉900g', product_price: 299.00, product_sale_price: 249.00, product_category_id: 7, product_is_enabled: 1 },
  { product_name: '儿童益智玩具', product_title: '儿童益智积木玩具', product_price: 199.00, product_sale_price: 129.00, product_category_id: 7, product_is_enabled: 1 },
  { product_name: '婴儿纸尿裤', product_title: '透气婴儿纸尿裤', product_price: 99.00, product_sale_price: 79.00, product_category_id: 7, product_is_enabled: 1 },
  { product_name: '儿童安全座椅', product_title: '车载儿童安全座椅', product_price: 899.00, product_sale_price: 699.00, product_category_id: 7, product_is_enabled: 1 },
  { product_name: '婴儿推车', product_title: '轻便婴儿推车', product_price: 599.00, product_sale_price: 499.00, product_category_id: 7, product_is_enabled: 1 },
  { product_name: '早教机', product_title: '智能早教机', product_price: 299.00, product_sale_price: 199.00, product_category_id: 7, product_is_enabled: 1 },
  { product_name: '儿童服装', product_title: '纯棉儿童服装套装', product_price: 159.00, product_sale_price: 109.00, product_category_id: 7, product_is_enabled: 1 },
  { product_name: '奶瓶套装', product_title: '防胀气奶瓶套装', product_price: 129.00, product_sale_price: 89.00, product_category_id: 7, product_is_enabled: 1 },
  
  // 零食/茶酒/进口食品 (category_id: 8)
  { product_name: '进口巧克力', product_title: '比利时进口巧克力', product_price: 99.00, product_sale_price: 69.00, product_category_id: 8, product_is_enabled: 1 },
  { product_name: '精品咖啡豆', product_title: '进口精品咖啡豆500g', product_price: 199.00, product_sale_price: 149.00, product_category_id: 8, product_is_enabled: 1 },
  { product_name: '红酒', product_title: '法国进口红酒', product_price: 299.00, product_sale_price: 199.00, product_category_id: 8, product_is_enabled: 1 },
  { product_name: '坚果礼盒', product_title: '混合坚果礼盒1kg', product_price: 159.00, product_sale_price: 99.00, product_category_id: 8, product_is_enabled: 1 },
  { product_name: '绿茶礼盒', product_title: '特级绿茶礼盒200g', product_price: 199.00, product_sale_price: 149.00, product_category_id: 8, product_is_enabled: 1 },
  { product_name: '进口饼干', product_title: '意大利进口饼干', product_price: 79.00, product_sale_price: 49.00, product_category_id: 8, product_is_enabled: 1 },
  { product_name: '威士忌', product_title: '苏格兰威士忌700ml', product_price: 499.00, product_sale_price: 399.00, product_category_id: 8, product_is_enabled: 1 },
  { product_name: '牛肉干', product_title: '内蒙古牛肉干500g', product_price: 129.00, product_sale_price: 89.00, product_category_id: 8, product_is_enabled: 1 },
  
  // 生鲜水果 (category_id: 9)
  { product_name: '新鲜苹果', product_title: '红富士新鲜苹果5斤装', product_price: 29.90, product_sale_price: 19.90, product_category_id: 9, product_is_enabled: 1 },
  { product_name: '精品橙子', product_title: '赣南脐橙精品橙子3斤', product_price: 19.90, product_sale_price: 14.90, product_category_id: 9, product_is_enabled: 1 },
  { product_name: '进口车厘子', product_title: '智利进口车厘子2斤', product_price: 79.90, product_sale_price: 59.90, product_category_id: 9, product_is_enabled: 1 },
  { product_name: '新鲜猪肉', product_title: '新鲜猪肉后腿肉2斤', product_price: 39.90, product_sale_price: 29.90, product_category_id: 9, product_is_enabled: 1 },
  { product_name: '鲜活大闸蟹', product_title: '阳澄湖大闸蟹4只装', product_price: 199.00, product_sale_price: 149.00, product_category_id: 9, product_is_enabled: 1 },
  { product_name: '有机蔬菜', product_title: '有机蔬菜组合套餐', product_price: 49.90, product_sale_price: 39.90, product_category_id: 9, product_is_enabled: 1 },
  { product_name: '新鲜鸡蛋', product_title: '土鸡蛋30枚装', product_price: 29.90, product_sale_price: 19.90, product_category_id: 9, product_is_enabled: 1 },
  { product_name: '进口牛肉', product_title: '澳洲进口牛肉1kg', product_price: 99.90, product_sale_price: 79.90, product_category_id: 9, product_is_enabled: 1 },
  
  // 大家电/生活电器 (category_id: 10)
  { product_name: '智能电视', product_title: '65寸4K智能电视', product_price: 3999.00, product_sale_price: 2999.00, product_category_id: 10, product_is_enabled: 1 },
  { product_name: '冰箱', product_title: '三门节能冰箱', product_price: 2999.00, product_sale_price: 2299.00, product_category_id: 10, product_is_enabled: 1 },
  { product_name: '空调', product_title: '1.5匹变频空调', product_price: 2999.00, product_sale_price: 2399.00, product_category_id: 10, product_is_enabled: 1 },
  { product_name: '洗衣机', product_title: '全自动洗衣机', product_price: 1999.00, product_sale_price: 1599.00, product_category_id: 10, product_is_enabled: 1 },
  { product_name: '电饭煲', product_title: '智能电饭煲', product_price: 399.00, product_sale_price: 299.00, product_category_id: 10, product_is_enabled: 1 },
  { product_name: '微波炉', product_title: '平板微波炉', product_price: 499.00, product_sale_price: 399.00, product_category_id: 10, product_is_enabled: 1 },
  { product_name: '空气净化器', product_title: '除甲醛空气净化器', product_price: 999.00, product_sale_price: 799.00, product_category_id: 10, product_is_enabled: 1 },
  { product_name: '扫地机器人', product_title: '智能扫地机器人', product_price: 1299.00, product_sale_price: 999.00, product_category_id: 10, product_is_enabled: 1 },
  
  // 家居建材 (category_id: 11)
  { product_name: '实木餐桌', product_title: '北欧风格实木餐桌', product_price: 1999.00, product_sale_price: 1499.00, product_category_id: 11, product_is_enabled: 1 },
  { product_name: '布艺沙发', product_title: '舒适布艺沙发三人位', product_price: 2999.00, product_sale_price: 2299.00, product_category_id: 11, product_is_enabled: 1 },
  { product_name: '实木床', product_title: '1.8米实木双人床', product_price: 2499.00, product_sale_price: 1899.00, product_category_id: 11, product_is_enabled: 1 },
  { product_name: '衣柜', product_title: '推拉门衣柜', product_price: 1999.00, product_sale_price: 1499.00, product_category_id: 11, product_is_enabled: 1 },
  { product_name: '瓷砖', product_title: '防滑瓷砖800x800', product_price: 99.00, product_sale_price: 79.00, product_category_id: 11, product_is_enabled: 1 },
  { product_name: '木地板', product_title: '实木复合地板', product_price: 199.00, product_sale_price: 149.00, product_category_id: 11, product_is_enabled: 1 },
  { product_name: '吊灯', product_title: '现代简约吊灯', product_price: 399.00, product_sale_price: 299.00, product_category_id: 11, product_is_enabled: 1 },
  { product_name: '窗帘', product_title: '遮光窗帘套装', product_price: 299.00, product_sale_price: 199.00, product_category_id: 11, product_is_enabled: 1 },
  
  // 汽车/配件/用品 (category_id: 12)
  { product_name: '汽车坐垫', product_title: '四季通用汽车坐垫', product_price: 299.00, product_sale_price: 199.00, product_category_id: 12, product_is_enabled: 1 },
  { product_name: '行车记录仪', product_title: '高清夜视行车记录仪', product_price: 399.00, product_sale_price: 299.00, product_category_id: 12, product_is_enabled: 1 },
  { product_name: '车载充电器', product_title: '快充车载充电器', product_price: 59.00, product_sale_price: 39.00, product_category_id: 12, product_is_enabled: 1 },
  { product_name: '汽车脚垫', product_title: '全包围汽车脚垫', product_price: 199.00, product_sale_price: 149.00, product_category_id: 12, product_is_enabled: 1 },
  { product_name: '汽车香水', product_title: '持久香氛汽车香水', product_price: 49.00, product_sale_price: 29.00, product_category_id: 12, product_is_enabled: 1 },
  { product_name: '车载空气净化器', product_title: '负离子车载空气净化器', product_price: 299.00, product_sale_price: 199.00, product_category_id: 12, product_is_enabled: 1 },
  { product_name: '汽车贴膜', product_title: '防爆隔热汽车贴膜', product_price: 599.00, product_sale_price: 399.00, product_category_id: 12, product_is_enabled: 1 },
  { product_name: '车载冰箱', product_title: '便携式车载冰箱', product_price: 499.00, product_sale_price: 399.00, product_category_id: 12, product_is_enabled: 1 },
  
  // 家纺/家饰/鲜花 (category_id: 13)
  { product_name: '四件套', product_title: '纯棉四件套床品', product_price: 299.00, product_sale_price: 199.00, product_category_id: 13, product_is_enabled: 1 },
  { product_name: '蚕丝被', product_title: '100%桑蚕丝被', product_price: 599.00, product_sale_price: 449.00, product_category_id: 13, product_is_enabled: 1 },
  { product_name: '抱枕', product_title: '舒适抱枕一对装', product_price: 79.00, product_sale_price: 59.00, product_category_id: 13, product_is_enabled: 1 },
  { product_name: '玫瑰花束', product_title: '99朵红玫瑰花束', product_price: 299.00, product_sale_price: 199.00, product_category_id: 13, product_is_enabled: 1 },
  { product_name: '装饰画', product_title: '现代简约装饰画', product_price: 199.00, product_sale_price: 149.00, product_category_id: 13, product_is_enabled: 1 },
  { product_name: '花瓶', product_title: '陶瓷花瓶套装', product_price: 129.00, product_sale_price: 89.00, product_category_id: 13, product_is_enabled: 1 },
  { product_name: '地毯', product_title: '北欧风格地毯', product_price: 399.00, product_sale_price: 299.00, product_category_id: 13, product_is_enabled: 1 },
  { product_name: '多肉植物', product_title: '多肉植物组合盆栽', product_price: 49.00, product_sale_price: 29.00, product_category_id: 13, product_is_enabled: 1 },
  
  // 医药保健 (category_id: 14)
  { product_name: '维生素C片', product_title: '高含量维生素C片100片', product_price: 59.00, product_sale_price: 39.00, product_category_id: 14, product_is_enabled: 1 },
  { product_name: '钙片', product_title: '成人钙片补钙产品', product_price: 79.00, product_sale_price: 59.00, product_category_id: 14, product_is_enabled: 1 },
  { product_name: '蛋白粉', product_title: '乳清蛋白粉1kg', product_price: 299.00, product_sale_price: 199.00, product_category_id: 14, product_is_enabled: 1 },
  { product_name: '血压计', product_title: '电子血压计家用', product_price: 199.00, product_sale_price: 149.00, product_category_id: 14, product_is_enabled: 1 },
  { product_name: '体温计', product_title: '电子体温计', product_price: 39.00, product_sale_price: 29.00, product_category_id: 14, product_is_enabled: 1 },
  { product_name: '按摩器', product_title: '颈椎按摩器', product_price: 299.00, product_sale_price: 199.00, product_category_id: 14, product_is_enabled: 1 },
  { product_name: '护眼贴', product_title: '缓解疲劳护眼贴', product_price: 49.00, product_sale_price: 29.00, product_category_id: 14, product_is_enabled: 1 },
  { product_name: '鱼油胶囊', product_title: '深海鱼油胶囊', product_price: 129.00, product_sale_price: 99.00, product_category_id: 14, product_is_enabled: 1 },
  
  // 厨具/收纳/宠物 (category_id: 15)
  { product_name: '不粘锅', product_title: '不粘涂层平底锅', product_price: 199.00, product_sale_price: 149.00, product_category_id: 15, product_is_enabled: 1 },
  { product_name: '刀具套装', product_title: '不锈钢刀具套装', product_price: 299.00, product_sale_price: 199.00, product_category_id: 15, product_is_enabled: 1 },
  { product_name: '收纳箱', product_title: '塑料收纳箱大号', product_price: 49.00, product_sale_price: 29.00, product_category_id: 15, product_is_enabled: 1 },
  { product_name: '狗粮', product_title: '天然狗粮10kg', product_price: 299.00, product_sale_price: 199.00, product_category_id: 15, product_is_enabled: 1 },
  { product_name: '猫粮', product_title: '全价猫粮5kg', product_price: 199.00, product_sale_price: 149.00, product_category_id: 15, product_is_enabled: 1 },
  { product_name: '宠物玩具', product_title: '互动宠物玩具套装', product_price: 79.00, product_sale_price: 59.00, product_category_id: 15, product_is_enabled: 1 },
  { product_name: '厨房置物架', product_title: '不锈钢厨房置物架', product_price: 129.00, product_sale_price: 89.00, product_category_id: 15, product_is_enabled: 1 },
  { product_name: '宠物窝', product_title: '舒适宠物窝', product_price: 149.00, product_sale_price: 99.00, product_category_id: 15, product_is_enabled: 1 },
  
  // 图书音像 (category_id: 16)
  { product_name: '编程入门书籍', product_title: 'Python编程从入门到实践', product_price: 89.00, product_sale_price: 69.00, product_category_id: 16, product_is_enabled: 1 },
  { product_name: '小说', product_title: '经典文学小说集', product_price: 59.00, product_sale_price: 39.00, product_category_id: 16, product_is_enabled: 1 },
  { product_name: '儿童绘本', product_title: '精美儿童绘本套装', product_price: 99.00, product_sale_price: 79.00, product_category_id: 16, product_is_enabled: 1 },
  { product_name: '音乐CD', product_title: '经典流行音乐CD', product_price: 49.00, product_sale_price: 29.00, product_category_id: 16, product_is_enabled: 1 },
  { product_name: '英语教材', product_title: '新概念英语教材', product_price: 79.00, product_sale_price: 59.00, product_category_id: 16, product_is_enabled: 1 },
  { product_name: '历史书籍', product_title: '中国历史通史', product_price: 129.00, product_sale_price: 99.00, product_category_id: 16, product_is_enabled: 1 },
  { product_name: '漫画书', product_title: '热门漫画单行本', product_price: 29.00, product_sale_price: 19.00, product_category_id: 16, product_is_enabled: 1 },
  { product_name: '有声读物', product_title: '经典有声读物', product_price: 59.00, product_sale_price: 39.00, product_category_id: 16, product_is_enabled: 1 }
]

async function initializeData() {
  try {
    console.log('🚀 开始初始化商品分类和商品数据...')
    
    // 检查分类是否已存在
    const { data: existingCategories, error: categoryError } = await supabase
      .from('category')
      .select('category_name')
    
    if (categoryError) throw categoryError
    
    const existingCategoryNames = existingCategories.map(c => c.category_name)
    const newCategories = categories.filter(c => !existingCategoryNames.includes(c.category_name))
    
    // 插入新分类
    if (newCategories.length > 0) {
      const { data: insertedCategories, error: insertCategoryError } = await supabase
        .from('category')
        .insert(newCategories)
        .select()
      
      if (insertCategoryError) throw insertCategoryError
      console.log('✅ 插入分类成功:', insertedCategories.length, '个')
    } else {
      console.log('ℹ️ 分类已存在，跳过插入')
    }
    
    // 获取所有分类ID
    const { data: allCategories, error: allCategoryError } = await supabase
      .from('category')
      .select('category_id, category_name')
    
    if (allCategoryError) throw allCategoryError
    
    // 创建分类名称到ID的映射
    const categoryMap = {}
    allCategories.forEach(cat => {
      categoryMap[cat.category_name] = cat.category_id
    })
    
    // 更新商品数据中的分类ID
    const updatedProducts = products.map(product => {
      const categoryName = categories.find(cat => cat.category_id === product.product_category_id)?.category_name
      if (categoryName && categoryMap[categoryName]) {
        return {
          ...product,
          product_category_id: categoryMap[categoryName]
        }
      }
      return product
    })
    
    // 检查商品是否已存在
    const { data: existingProducts, error: productError } = await supabase
      .from('product')
      .select('product_name')
    
    if (productError) throw productError
    
    const existingProductNames = existingProducts.map(p => p.product_name)
    const newProducts = updatedProducts.filter(p => !existingProductNames.includes(p.product_name))
    
    // 插入新商品
    if (newProducts.length > 0) {
      const { data: insertedProducts, error: insertProductError } = await supabase
        .from('product')
        .insert(newProducts.map(({ product_image_src, ...product }) => product))
        .select()
      
      if (insertProductError) throw insertProductError
      console.log('✅ 插入商品成功:', insertedProducts.length, '个')
      
      // 插入商品图片
      const productImages = []
      insertedProducts.forEach((product, index) => {
        const originalProduct = newProducts[index]
        if (originalProduct.product_image_src) {
          productImages.push({
            product_image_type: 1, // 主图
            product_image_src: originalProduct.product_image_src,
            product_image_product_id: product.product_id
          })
        }
      })
      
      if (productImages.length > 0) {
        const { error: imageError } = await supabase
          .from('product_image')
          .insert(productImages)
        
        if (imageError) throw imageError
        console.log('✅ 插入商品图片成功:', productImages.length, '个')
      }
    } else {
      console.log('ℹ️ 商品已存在，跳过插入')
    }
    
    console.log('🎉 数据初始化完成!')
    console.log('📊 分类总数:', allCategories.length)
    console.log('📦 商品总数:', existingProducts.length + newProducts.length)
    
  } catch (error) {
    console.error('❌ 数据初始化失败:', error)
  }
}

initializeData()