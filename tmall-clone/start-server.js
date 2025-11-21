console.log('启动后端服务器...');

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// Supabase 客户端配置
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('缺少Supabase配置，请检查.env文件');
  process.exit(1);
}

console.log('Supabase配置:', { url: supabaseUrl ? '已配置' : '未配置' });

const supabase = createClient(supabaseUrl, supabaseKey);

// 获取地址列表接口 - 支持分级查询
app.get('/api/addresses', async (req, res) => {
  try {
    const { parentId = null } = req.query;
    console.log('获取地址列表，parentId:', parentId);
    
    let query = supabase
      .from('address')
      .select('address_area_id, address_name, address_region_id')
      .order('address_area_id');

    if (parentId) {
      query = query.eq('address_region_id', parentId);
    } else {
      query = query.is('address_region_id', null);
    }

    const { data: addresses, error } = await query;

    if (error) {
      throw error;
    }

    console.log('地址查询结果，数量:', addresses ? addresses.length : 0);
    res.json({
      success: true,
      message: '获取地址列表成功',
      data: addresses || []
    });
  } catch (error) {
    console.error('获取地址列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取地址列表失败',
      error: error.message
    });
  }
});

// 注册接口
app.post('/api/register', async (req, res) => {
  try {
    const { user_name, user_password } = req.body;

    if (!user_name || !user_password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码为必填项'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_password, salt);

    const { data, error } = await supabase
      .from('user')
      .insert([{
        user_name,
        user_password: hashedPassword
      }])
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: '注册失败',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: data ? data[0] : null
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 测试接口
app.get('/api/test', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user')
      .select('user_id')
      .limit(1);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Supabase连接正常',
      userCount: data ? data.length : 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Supabase连接失败',
      error: error.message
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`✅ 服务器成功启动在端口 ${PORT}`);
  console.log(`📍 API地址: http://localhost:${PORT}/api`);
  console.log(`🔧 测试地址: http://localhost:${PORT}/api/test`);
  console.log(`🏠 地址API: http://localhost:${PORT}/api/addresses`);
});

console.log('正在启动服务器...');