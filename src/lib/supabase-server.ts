import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Server client (for server components only)
export const createSupabaseServerClient = () => createServerComponentClient({ cookies })