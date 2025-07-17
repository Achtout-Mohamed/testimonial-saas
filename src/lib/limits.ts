import { supabaseAdmin } from '@/lib/supabase-admin'

export const FREE_LIMITS = {
  testimonials: 10,
  widgets: 1,
  features: ['basic_dashboard', 'email_collection', 'basic_widget']
}

export async function checkTestimonialLimit(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)

  if (error) return false
  
  return (data?.length || 0) < FREE_LIMITS.testimonials
}

export async function getUserTestimonialCount(userId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)

  if (error) return 0
  return data?.length || 0
}