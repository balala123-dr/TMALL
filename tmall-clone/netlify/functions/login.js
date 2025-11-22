const { getSupabaseClient, parseBody, createResponse } = require('./_utils/supabase')

exports.handler = async (event) => {
  // 处理 CORS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, {})
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { success: false, message: '方法不允许' })
  }

  try {
    const loginData = parseBody(event)
    console.log('🔑 收到登录请求:', loginData)

    const supabase = getSupabaseClient()

    // 从Supabase查询用户
    const { data: user, error } = await supabase
      .from('user')
      .select('*')
      .eq('user_name', loginData.user_name)
      .maybeSingle()

    if (error || !user) {
      console.error('❌ 用户不存在:', error)
      return createResponse(401, {
        success: false,
        message: '用户名或密码错误'
      })
    }

    console.log('✅ 登录成功:', user)
    return createResponse(200, {
      success: true,
      message: '登录成功',
      data: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_nickname: user.user_nickname,
        user_realname: user.user_realname,
        user_gender: user.user_gender,
        user_birthday: user.user_birthday,
        user_address: user.user_address
      }
    })
  } catch (error) {
    console.error('❌ 登录错误:', error)
    return createResponse(500, {
      success: false,
      message: '登录失败',
      error: error.message
    })
  }
}

