import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error('Faltam as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ficheiro .env')
}

export const supabase = createClient(url, key)
