// src/lib/analytics.ts
export interface AnalyticsEvent {
  userId: string
  eventType: string
  eventName: string
  properties?: Record<string, any>
  url?: string
  referrer?: string
  sessionId?: string
}

export interface TestimonialAnalyticsEvent {
  userId: string
  testimonialId?: string
  eventType: 'form_view' | 'form_start' | 'form_submit' | 'form_complete'
  formData?: Record<string, any>
  referrer?: string
  sessionId?: string
}

export interface WidgetAnalyticsEvent {
  userId: string
  widgetId?: string
  eventType: 'widget_load' | 'widget_view' | 'testimonial_click'
  websiteDomain?: string
  referrer?: string
  sessionId?: string
  properties?: Record<string, any>
}

class Analytics {
  private sessionId: string
  private userId: string | null = null

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  setUserId(userId: string) {
    this.userId = userId
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getCurrentUrl(): string {
    return typeof window !== 'undefined' ? window.location.href : ''
  }

  private getReferrer(): string {
    return typeof window !== 'undefined' ? document.referrer : ''
  }

  async track(event: Omit<AnalyticsEvent, 'sessionId' | 'userId'>) {
    if (!this.userId) {
      console.warn('Analytics: No user ID set')
      return
    }

    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          userId: this.userId,
          url: event.url || this.getCurrentUrl(),
          referrer: event.referrer || this.getReferrer(),
          sessionId: this.sessionId
        })
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  async trackTestimonial(event: Omit<TestimonialAnalyticsEvent, 'sessionId'>) {
    if (!event.userId) {
      console.warn('Analytics: No user ID provided')
      return
    }

    try {
      await fetch('/api/analytics/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          referrer: event.referrer || this.getReferrer(),
          sessionId: this.sessionId
        })
      })
    } catch (error) {
      console.error('Testimonial analytics tracking error:', error)
    }
  }

  async trackWidget(event: Omit<WidgetAnalyticsEvent, 'sessionId'>) {
    if (!event.userId) {
      console.warn('Analytics: No user ID provided')
      return
    }

    try {
      await fetch('/api/analytics/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          referrer: event.referrer || this.getReferrer(),
          sessionId: this.sessionId,
          websiteDomain: event.websiteDomain || (typeof window !== 'undefined' ? window.location.hostname : '')
        })
      })
    } catch (error) {
      console.error('Widget analytics tracking error:', error)
    }
  }

  // Convenience methods
  async trackPageView(pageName: string, properties?: Record<string, any>) {
    await this.track({
      eventType: 'page_view',
      eventName: pageName,
      properties
    })
  }

  async trackTestimonialFormView(userId: string) {
    await this.trackTestimonial({
      userId,
      eventType: 'form_view'
    })
  }

  async trackTestimonialFormStart(userId: string) {
    await this.trackTestimonial({
      userId,
      eventType: 'form_start'
    })
  }

  async trackTestimonialSubmission(userId: string, testimonialId?: string, formData?: Record<string, any>) {
    await this.trackTestimonial({
      userId,
      testimonialId,
      eventType: 'form_submit',
      formData
    })
  }

  async trackTestimonialComplete(userId: string, testimonialId?: string) {
    await this.trackTestimonial({
      userId,
      testimonialId,
      eventType: 'form_complete'
    })
  }

  async trackWidgetLoad(userId: string, widgetId?: string) {
    await this.trackWidget({
      userId,
      widgetId,
      eventType: 'widget_load'
    })
  }

  async trackWidgetView(userId: string, widgetId?: string) {
    await this.trackWidget({
      userId,
      widgetId,
      eventType: 'widget_view'
    })
  }

  async trackTestimonialClick(userId: string, widgetId?: string, testimonialId?: string) {
    await this.trackWidget({
      userId,
      widgetId,
      eventType: 'testimonial_click',
      properties: { testimonialId }
    })
  }
}

// Create a singleton instance
export const analytics = new Analytics()

// React hook for analytics
import { useEffect } from 'react'
import { User } from '@supabase/supabase-js'

export function useAnalytics(user: User | null) {
  useEffect(() => {
    if (user) {
      analytics.setUserId(user.id)
    }
  }, [user])

  return analytics
}

// Higher-order component for automatic page tracking
import { useRouter } from 'next/navigation'

export function usePageTracking(user: User | null, pageName?: string) {
  const router = useRouter()
  const analyticsInstance = useAnalytics(user)

  useEffect(() => {
    if (user && pageName) {
      analyticsInstance.trackPageView(pageName)
    }
  }, [user, pageName, analyticsInstance])

  return analyticsInstance
}