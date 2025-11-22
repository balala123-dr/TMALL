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
    const userData = parseBody(event)
    console.log('📝 收到注册请求:', userData)

    const supabase = getSupabaseClient()

    // 保存用户地址为省市区文本，而不是邮政编码
    const { data, error } = await supabase
      .from('user')
      .insert([{
        user_name: userData.user_name?.substring(0, 50),
        user_password: userData.user_password?.substring(0, 255),
        user_nickname: userData.user_nickname ? userData.user_nickname.substring(0, 50) : null,
        user_realname: userData.user_realname ? userData.user_realname.substring(0, 50) : null,
        user_gender: userData.user_gender ? String(userData.user_gender).substring(0, 10) : null,
        user_birthday: userData.user_birthday ? userData.user_birthday.substring(0, 20) : null,
        user_address: userData.user_address ? userData.user_address.substring(0, 200) : null
      }])
      .select()

    if (error) {
      console.error('❌ Supabase保存错误:', error)
      return createResponse(500, {
        success: false,
        message: '注册失败: ' + error.message,
        error: error
      })
    }

    console.log('✅ 注册成功:', data[0])
    return createResponse(201, {
      success: true,
      message: '注册成功',
      data: data[0]
    })
  } catch (error) {
    console.error('❌ 注册错误:', error)
    return createResponse(500, {
      success: false,
      message: '注册失败',
      error: error.message
    })
  }
}

