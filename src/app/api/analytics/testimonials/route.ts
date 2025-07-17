// src/app/api/analytics/testimonials/route.ts
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, testimonialId, eventType, formData = {}, referrer, sessionId } = body

    if (!userId || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('testimonial_analytics')
      .insert({
        user_id: userId,
        testimonial_id: testimonialId,
        event_type: eventType,
        form_data: formData,
        referrer,
        session_id: sessionId
      })
      .select()

    if (error) {
      console.error('Testimonial analytics error:', error)
      return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Testimonial analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}