import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (only use public keys)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Component client (for React components)
export const createSupabaseComponentClient = () => createClientComponentClient()

// Note: Admin client is moved to a separate file for server-only use