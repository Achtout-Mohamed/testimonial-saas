// src/app/api/admin/analytics/route.ts
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSession } from '@/lib/admin-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const sessionToken = request.cookies.get('admin-session')?.value
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminUserId = await verifyAdminSession(sessionToken)
    if (!adminUserId) {
      return NextResponse.json({ error: 'Invalid admin session' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = parseInt(searchParams.get('period') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - period)

    // Get total users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, created_at, email')

    // Get total testimonials
    const { data: testimonials, error: testimonialsError } = await supabaseAdmin
      .from('testimonials')
      .select('id, rating, created_at, approved')

    // Get widget analytics
    const { data: widgetAnalytics, error: widgetError } = await supabaseAdmin
      .from('widget_analytics')
      .select('*')
      .gte('created_at', startDate.toISOString())

    // Get recent activity with user emails
    const { data: recentActivity, error: activityError } = await supabaseAdmin
      .from('analytics_events')
      .select(`
        event_type,
        created_at,
        properties,
        user_id
      `)
      .order('created_at', { ascending: false })
      .limit(20)

    if (usersError || testimonialsError || widgetError || activityError) {
      console.error('Database query error:', { 
        usersError, 
        testimonialsError, 
        widgetError, 
        activityError 
      })
      return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
    }

    // Process data
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const usersThisMonth = users?.filter(u => new Date(u.created_at) >= thisMonth).length || 0
    const usersLastMonth = users?.filter(u => {
      const createdAt = new Date(u.created_at)
      return createdAt >= lastMonth && createdAt < thisMonth
    }).length || 0

    const testimonialsThisMonth = testimonials?.filter(t => new Date(t.created_at) >= thisMonth).length || 0

    const growthPercentage = usersLastMonth > 0 ? 
      Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100) : 0

    // Calculate average rating
    const approvedTestimonials = testimonials?.filter(t => t.approved) || []
    const averageRating = approvedTestimonials.length > 0 ? 
      (approvedTestimonials.reduce((sum, t) => sum + t.rating, 0) / approvedTestimonials.length).toFixed(1) : '0'

    // Get top domains
    const domainCounts = new Map<string, number>()
    widgetAnalytics?.forEach(w => {
      if (w.website_domain) {
        domainCounts.set(w.website_domain, (domainCounts.get(w.website_domain) || 0) + 1)
      }
    })

    const topDomains = Array.from(domainCounts.entries())
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Calculate conversion rate (simplified)
    const totalFormViews = widgetAnalytics?.filter(w => w.event_type === 'widget_load').length || 0
    const totalSubmissions = testimonials?.length || 0
    const conversionRate = totalFormViews > 0 ? 
      ((totalSubmissions / totalFormViews) * 100).toFixed(1) : '0'

    // Format recent activity - get user emails
    const formattedActivity = await Promise.all(
      (recentActivity || []).map(async (activity) => {
        const user = users?.find(u => u.id === activity.user_id)
        return {
          type: activity.event_type,
          user_email: user?.email || 'Unknown User',
          created_at: activity.created_at,
          properties: activity.properties || {}
        }
      })
    )

    const analytics = {
      totalUsers: users?.length || 0,
      totalTestimonials: testimonials?.length || 0,
      totalWidgetLoads: widgetAnalytics?.filter(w => w.event_type === 'widget_load').length || 0,
      averageRating,
      conversionRate,
      topDomains,
      recentActivity: formattedActivity,
      growthStats: {
        usersThisMonth,
        testimonialsThisMonth,
        growthPercentage
      }
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Admin analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Endpoint to get detailed analytics for a specific user (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const sessionToken = request.cookies.get('admin-session')?.value
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminUserId = await verifyAdminSession(sessionToken)
    if (!adminUserId) {
      return NextResponse.json({ error: 'Invalid admin session' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, period = 30 } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - period)

    // Get user's analytics data
    const [
      { data: userEvents },
      { data: testimonialEvents },
      { data: widgetEvents },
      { data: userTestimonials }
    ] = await Promise.all([
      supabaseAdmin
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString()),
      
      supabaseAdmin
        .from('testimonial_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString()),
      
      supabaseAdmin
        .from('widget_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString()),
      
      supabaseAdmin
        .from('testimonials')
        .select('*')
        .eq('user_id', userId)
    ])

    const userAnalytics = {
      events: {
        total: userEvents?.length || 0,
        byType: groupByEventType(userEvents || [])
      },
      testimonials: {
        total: userTestimonials?.length || 0,
        approved: userTestimonials?.filter(t => t.approved).length || 0,
        pending: userTestimonials?.filter(t => !t.approved).length || 0,
        averageRating: userTestimonials?.length ? 
          (userTestimonials.reduce((sum, t) => sum + t.rating, 0) / userTestimonials.length).toFixed(1) : '0'
      },
      collection: {
        formViews: testimonialEvents?.filter(e => e.event_type === 'form_view').length || 0,
        formStarts: testimonialEvents?.filter(e => e.event_type === 'form_start').length || 0,
        formSubmissions: testimonialEvents?.filter(e => e.event_type === 'form_submit').length || 0,
        completions: testimonialEvents?.filter(e => e.event_type === 'form_complete').length || 0
      },
      widgets: {
        loads: widgetEvents?.filter(e => e.event_type === 'widget_load').length || 0,
        views: widgetEvents?.filter(e => e.event_type === 'widget_view').length || 0,
        clicks: widgetEvents?.filter(e => e.event_type === 'testimonial_click').length || 0,
        domains: [...new Set(widgetEvents?.map(e => e.website_domain))].filter(Boolean)
      },
      timeline: generateTimeline(userEvents || [], testimonialEvents || [], widgetEvents || [])
    }

    return NextResponse.json(userAnalytics)

  } catch (error) {
    console.error('User analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper functions
function groupByEventType(events: any[]) {
  const grouped: Record<string, number> = {}
  events.forEach(event => {
    grouped[event.event_type] = (grouped[event.event_type] || 0) + 1
  })
  return grouped
}

function generateTimeline(userEvents: any[], testimonialEvents: any[], widgetEvents: any[]) {
  const allEvents = [
    ...userEvents.map(e => ({ ...e, source: 'user' })),
    ...testimonialEvents.map(e => ({ ...e, source: 'testimonial' })),
    ...widgetEvents.map(e => ({ ...e, source: 'widget' }))
  ]

  return allEvents
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 50) // Last 50 events
    .map(event => ({
      type: event.event_type,
      source: event.source,
      timestamp: event.created_at,
      properties: event.properties || {}
    }))
}