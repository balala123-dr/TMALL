// Netlify Functions 共享的 Supabase 客户端
const { createClient } = require('@supabase/supabase-js')

function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  // 优先使用service role key（可以绕过RLS），如果没有则使用anon key
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase 配置缺失，请检查环境变量')
  }

  return createClient(supabaseUrl, supabaseKey)
}

function parseBody(event) {
  try {
    return JSON.parse(event.body || '{}')
  } catch (error) {
    return {}
  }
}

function createResponse(statusCode, data) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify(data)
  }
}

module.exports = {
  getSupabaseClient,
  parseBody,
  createResponse
}

