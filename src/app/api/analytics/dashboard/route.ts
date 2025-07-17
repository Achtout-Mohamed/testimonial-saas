// src/app/api/analytics/dashboard/route.ts
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const period = searchParams.get('period') || '30'

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const periodDays = parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodDays)

    // Get testimonial collection stats
    const { data: testimonialStats, error: testimonialError } = await supabaseAdmin
      .from('testimonial_analytics')
      .select('event_type, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())

    // Get widget performance stats
    const { data: widgetStats, error: widgetError } = await supabaseAdmin
      .from('widget_analytics')
      .select('event_type, created_at, website_domain')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())

    // Get testimonial counts
    const { data: testimonials, error: testimonialsError } = await supabaseAdmin
      .from('testimonials')
      .select('approved, rating, created_at')
      .eq('user_id', userId)

    if (testimonialError || widgetError || testimonialsError) {
      console.error('Analytics query error:', { testimonialError, widgetError, testimonialsError })
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }

    // Process data for dashboard
    const analytics = {
      testimonials: {
        total: testimonials?.length || 0,
        approved: testimonials?.filter(t => t.approved).length || 0,
        pending: testimonials?.filter(t => !t.approved).length || 0,
        averageRating: testimonials?.length ? 
          (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '0'
      },
      collection: {
        formViews: testimonialStats?.filter(s => s.event_type === 'form_view').length || 0,
        formStarts: testimonialStats?.filter(s => s.event_type === 'form_start').length || 0,
        formSubmissions: testimonialStats?.filter(s => s.event_type === 'form_submit').length || 0,
        completions: testimonialStats?.filter(s => s.event_type === 'form_complete').length || 0
      },
      widgets: {
        loads: widgetStats?.filter(w => w.event_type === 'widget_load').length || 0,
        views: widgetStats?.filter(w => w.event_type === 'widget_view').length || 0,
        clicks: widgetStats?.filter(w => w.event_type === 'testimonial_click').length || 0,
        uniqueDomains: [...new Set(widgetStats?.map(w => w.website_domain))].filter(Boolean).length
      },
      period: periodDays
    }

    // Calculate conversion rates
    const conversion = {
      viewToStart: analytics.collection.formViews > 0 ? 
        ((analytics.collection.formStarts / analytics.collection.formViews) * 100).toFixed(1) : '0',
      startToSubmit: analytics.collection.formStarts > 0 ? 
        ((analytics.collection.formSubmissions / analytics.collection.formStarts) * 100).toFixed(1) : '0',
      submitToComplete: analytics.collection.formSubmissions > 0 ? 
        ((analytics.collection.completions / analytics.collection.formSubmissions) * 100).toFixed(1) : '0'
    }

    return NextResponse.json({
      ...analytics,
      conversion
    })

  } catch (error) {
    console.error('Dashboard analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}