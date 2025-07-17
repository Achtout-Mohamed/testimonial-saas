import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)

    if (error) {
      return NextResponse.json({ error: 'Failed to get count' }, { status: 500 })
    }

    return NextResponse.json({ count: data?.length || 0 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}