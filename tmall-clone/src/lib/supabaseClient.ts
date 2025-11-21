import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase 尚未配置，请设置 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY')
  }
  return supabase
}



