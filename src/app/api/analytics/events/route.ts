// src/app/api/analytics/events/route.ts
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, eventType, eventName, properties = {}, url, referrer, sessionId } = body

    if (!userId || !eventType || !eventName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user agent and IP
    const userAgent = request.headers.get('user-agent') || undefined
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               undefined

    const { data, error } = await supabaseAdmin
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        event_name: eventName,
        properties,
        url,
        referrer,
        user_agent: userAgent,
        ip_address: ip,
        session_id: sessionId
      })
      .select()

    if (error) {
      console.error('Analytics error:', error)
      return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}