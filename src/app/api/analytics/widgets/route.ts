// src/app/api/analytics/widgets/route.ts
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, widgetId, eventType, websiteDomain, referrer, sessionId, properties = {} } = body

    if (!userId || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('widget_analytics')
      .insert({
        user_id: userId,
        widget_id: widgetId,
        event_type: eventType,
        website_domain: websiteDomain,
        referrer,
        session_id: sessionId,
        properties
      })
      .select()

    if (error) {
      console.error('Widget analytics error:', error)
      return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
    }

    // Enable CORS for widget tracking
    const response = NextResponse.json({ success: true, data })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'POST')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')

    return response

  } catch (error) {
    console.error('Widget analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}