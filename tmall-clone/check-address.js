import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testAddressTable() {
  try {
    console.log('检查address表是否存在...');
    
    const { data: tables, error } = await supabase
      .from('address')
      .select('*')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('address表为空或不存在');
      return false;
    } else if (error) {
      console.log('查询address表错误:', error);
      return false;
    }
    
    console.log('address表存在，数据条数:', tables ? tables.length : 0);
    
    // 检查表结构
    const { data: columns, error: columnError } = await supabase
      .from('address')
      .select('*')
      .limit(0);
    
    if (columnError) {
      console.log('检查表结构错误:', columnError);
    } else {
      console.log('表结构检查通过');
    }
    
    return true;
  } catch (err) {
    console.error('测试address表时出错:', err);
    return false;
  }
}

testAddressTable().then(result => {
  console.log('测试结果:', result);
  process.exit(0);
});