// src/components/AnalyticsDashboard.tsx
'use client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

interface AnalyticsData {
  testimonials: {
    total: number
    approved: number
    pending: number
    averageRating: string
  }
  collection: {
    formViews: number
    formStarts: number
    formSubmissions: number
    completions: number
  }
  widgets: {
    loads: number
    views: number
    clicks: number
    uniqueDomains: number
  }
  conversion: {
    viewToStart: string
    startToSubmit: string
    submitToComplete: string
  }
  period: number
}

interface AnalyticsDashboardProps {
  user: User
}

export default function AnalyticsDashboard({ user }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    if (user) {
      loadAnalytics()
    }
  }, [user, period])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/dashboard?userId=${user.id}&period=${period}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnalytics(data)
      } else {
        console.error('Failed to load analytics:', data.error)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{ color: '#6b7280' }}>Loading Analytics...</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
        <p style={{ color: '#ef4444' }}>Failed to load analytics data</p>
        <button
          onClick={loadAnalytics}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '12px'
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Header with Period Selector */}
      <div style={{
        background: 'white',
        padding: '20px 30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          margin: 0
        }}>
          📊 Analytics Dashboard
        </h2>
        
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#374151'
          }}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <MetricCard
          title="Total Testimonials"
          value={analytics.testimonials.total}
          icon="📝"
          color="#3b82f6"
          subtitle={`${analytics.testimonials.approved} approved, ${analytics.testimonials.pending} pending`}
        />
        
        <MetricCard
          title="Average Rating"
          value={analytics.testimonials.averageRating}
          icon="⭐"
          color="#f59e0b"
          subtitle="Customer satisfaction"
        />
        
        <MetricCard
          title="Form Views"
          value={analytics.collection.formViews}
          icon="👀"
          color="#10b981"
          subtitle="Collection page visits"
        />
        
        <MetricCard
          title="Conversion Rate"
          value={`${analytics.conversion.viewToStart}%`}
          icon="📈"
          color="#8b5cf6"
          subtitle="Views to submissions"
        />
      </div>

      {/* Collection Funnel */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '24px'
        }}>
          🎯 Collection Funnel
        </h3>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          <FunnelStep
            label="Form Views"
            value={analytics.collection.formViews}
            percentage={100}
            color="#3b82f6"
          />
          <FunnelStep
            label="Form Starts"
            value={analytics.collection.formStarts}
            percentage={analytics.collection.formViews > 0 ? 
              (analytics.collection.formStarts / analytics.collection.formViews) * 100 : 0}
            color="#10b981"
            conversionRate={analytics.conversion.viewToStart}
          />
          <FunnelStep
            label="Form Submissions"
            value={analytics.collection.formSubmissions}
            percentage={analytics.collection.formViews > 0 ? 
              (analytics.collection.formSubmissions / analytics.collection.formViews) * 100 : 0}
            color="#f59e0b"
            conversionRate={analytics.conversion.startToSubmit}
          />
          <FunnelStep
            label="Completions"
            value={analytics.collection.completions}
            percentage={analytics.collection.formViews > 0 ? 
              (analytics.collection.completions / analytics.collection.formViews) * 100 : 0}
            color="#8b5cf6"
            conversionRate={analytics.conversion.submitToComplete}
          />
        </div>
      </div>

      {/* Widget Performance */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '24px'
        }}>
          🎨 Widget Performance
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#3b82f6',
              marginBottom: '8px'
            }}>
              {analytics.widgets.loads}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Widget Loads</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '8px'
            }}>
              {analytics.widgets.views}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Widget Views</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#f59e0b',
              marginBottom: '8px'
            }}>
              {analytics.widgets.clicks}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Testimonial Clicks</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#8b5cf6',
              marginBottom: '8px'
            }}>
              {analytics.widgets.uniqueDomains}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Unique Domains</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '24px'
        }}>
          💡 Insights & Recommendations
        </h3>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          {generateInsights(analytics).map((insight, index) => (
            <div
              key={index}
              style={{
                background: insight.type === 'success' ? '#f0fdf4' : 
                           insight.type === 'warning' ? '#fefce8' : '#fef2f2',
                border: `1px solid ${
                  insight.type === 'success' ? '#bbf7d0' : 
                  insight.type === 'warning' ? '#fde047' : '#fca5a5'
                }`,
                padding: '16px',
                borderRadius: '8px'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>{insight.icon}</span>
                <span style={{
                  fontWeight: '600',
                  color: insight.type === 'success' ? '#166534' : 
                         insight.type === 'warning' ? '#a16207' : '#dc2626'
                }}>
                  {insight.title}
                </span>
              </div>
              <p style={{
                color: insight.type === 'success' ? '#15803d' : 
                       insight.type === 'warning' ? '#ca8a04' : '#dc2626',
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {insight.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper Components
function MetricCard({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle 
}: { 
  title: string
  value: string | number
  icon: string
  color: string
  subtitle?: string 
}) {
  return (
    <div style={{
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '32px',
        marginBottom: '8px'
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: '28px',
        fontWeight: '700',
        color,
        marginBottom: '4px'
      }}>
        {value}
      </div>
      <div style={{
        color: '#6b7280',
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: subtitle ? '4px' : 0
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{
          color: '#9ca3af',
          fontSize: '12px'
        }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}

function FunnelStep({ 
  label, 
  value, 
  percentage, 
  color, 
  conversionRate 
}: { 
  label: string
  value: number
  percentage: number
  color: string
  conversionRate?: string 
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{ minWidth: '120px' }}>
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          color
        }}>
          {value}
        </div>
        {conversionRate && (
          <div style={{
            fontSize: '12px',
            color: '#6b7280'
          }}>
            {conversionRate}% conversion
          </div>
        )}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{
          width: '100%',
          height: '8px',
          background: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min(percentage, 100)}%`,
            height: '100%',
            background: color,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  )
}

// Helper function to generate insights
function generateInsights(analytics: AnalyticsData) {
  const insights = []
  
  // Conversion rate insights
  const viewToStartRate = parseFloat(analytics.conversion.viewToStart)
  if (viewToStartRate < 20) {
    insights.push({
      type: 'error' as const,
      icon: '🚨',
      title: 'Low Conversion Rate',
      message: `Only ${analytics.conversion.viewToStart}% of visitors start filling your form. Consider simplifying your form or improving your call-to-action.`
    })
  } else if (viewToStartRate > 40) {
    insights.push({
      type: 'success' as const,
      icon: '🎉',
      title: 'Great Conversion Rate',
      message: `${analytics.conversion.viewToStart}% of visitors start your form - that's excellent! Your call-to-action is working well.`
    })
  }
  
  // Testimonial approval insights
  if (analytics.testimonials.pending > 5) {
    insights.push({
      type: 'warning' as const,
      icon: '⏰',
      title: 'Pending Testimonials',
      message: `You have ${analytics.testimonials.pending} testimonials waiting for approval. Approving them quickly helps maintain momentum.`
    })
  }
  
  // Widget performance insights
  if (analytics.widgets.loads > 0 && analytics.widgets.clicks === 0) {
    insights.push({
      type: 'warning' as const,
      icon: '🎯',
      title: 'No Widget Engagement',
      message: 'Your widgets are loading but not getting clicks. Consider making testimonials more prominent or adding call-to-action buttons.'
    })
  }
  
  // Average rating insights
  const avgRating = parseFloat(analytics.testimonials.averageRating)
  if (avgRating >= 4.5) {
    insights.push({
      type: 'success' as const,
      icon: '⭐',
      title: 'Excellent Reviews',
      message: `Your average rating of ${analytics.testimonials.averageRating} stars shows customers love your service! Make sure to highlight this.`
    })
  } else if (avgRating < 3.5 && analytics.testimonials.total > 3) {
    insights.push({
      type: 'error' as const,
      icon: '📉',
      title: 'Rating Concerns',
      message: `Your average rating of ${analytics.testimonials.averageRating} stars may indicate service issues. Consider reaching out to unhappy customers.`
    })
  }
  
  // Collection volume insights
  if (analytics.collection.formViews === 0) {
    insights.push({
      type: 'warning' as const,
      icon: '📢',
      title: 'No Collection Activity',
      message: 'Your testimonial collection form hasn\'t been viewed yet. Make sure to share your collection link with customers!'
    })
  }
  
  // Default insight if none apply
  if (insights.length === 0) {
    insights.push({
      type: 'success' as const,
      icon: '📊',
      title: 'All Systems Normal',
      message: 'Your testimonial collection system is performing well. Keep sharing your collection link to gather more reviews!'
    })
  }
  
  return insights
}