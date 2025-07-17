// src/app/admin/analytics/page.tsx
'use client'
import { useEffect, useState } from 'react'

interface GlobalAnalytics {
  totalUsers: number
  totalTestimonials: number
  totalWidgetLoads: number
  averageRating: string
  conversionRate: string
  topDomains: Array<{ domain: string; count: number }>
  recentActivity: Array<{
    type: string
    user_email: string
    created_at: string
    properties: any
  }>
  growthStats: {
    usersThisMonth: number
    testimonialsThisMonth: number
    growthPercentage: number
  }
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<GlobalAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    loadAnalytics()
  }, [period])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/admin/analytics?period=${period}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnalytics(data)
      } else {
        setError(data.error || 'Failed to load analytics')
      }
    } catch (error) {
      setError('Error loading analytics')
      console.error('Analytics error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading Global Analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#dc2626',
        padding: '16px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p>{error}</p>
        <button
          onClick={loadAnalytics}
          style={{
            background: '#dc2626',
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

  if (!analytics) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        No analytics data available
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            📊 Global Analytics
          </h1>
          <p style={{ color: '#6b7280' }}>
            Platform-wide performance and user engagement metrics
          </p>
        </div>
        
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <MetricCard
          title="Total Users"
          value={analytics.totalUsers}
          icon="👥"
          color="#3b82f6"
          growth={analytics.growthStats.usersThisMonth}
          subtitle="Active accounts"
        />
        
        <MetricCard
          title="Total Testimonials"
          value={analytics.totalTestimonials}
          icon="💬"
          color="#10b981"
          growth={analytics.growthStats.testimonialsThisMonth}
          subtitle="All time collected"
        />
        
        <MetricCard
          title="Widget Loads"
          value={analytics.totalWidgetLoads}
          icon="🎨"
          color="#f59e0b"
          subtitle="Across all websites"
        />
        
        <MetricCard
          title="Average Rating"
          value={analytics.averageRating}
          icon="⭐"
          color="#8b5cf6"
          subtitle="Customer satisfaction"
        />
      </div>

      {/* Growth Chart */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        marginBottom: '32px'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '24px'
        }}>
          📈 Growth Overview
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#3b82f6',
              marginBottom: '8px'
            }}>
              {analytics.growthStats.usersThisMonth}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>New Users This Month</div>
            <div style={{
              fontSize: '12px',
              color: analytics.growthStats.growthPercentage > 0 ? '#10b981' : '#dc2626',
              marginTop: '4px'
            }}>
              {analytics.growthStats.growthPercentage > 0 ? '↗️' : '↘️'} {Math.abs(analytics.growthStats.growthPercentage)}%
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '8px'
            }}>
              {analytics.growthStats.testimonialsThisMonth}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>New Testimonials This Month</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#f59e0b',
              marginBottom: '8px'
            }}>
              {analytics.conversionRate}%
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Overall Conversion Rate</div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '32px'
      }}>
        
        {/* Top Domains */}
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
            🌐 Top Widget Domains
          </h3>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            {analytics.topDomains.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌐</div>
                <p>No widget activity yet</p>
              </div>
            ) : (
              analytics.topDomains.map((domain, index) => (
                <div
                  key={domain.domain}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: index === 0 ? '#f0f9ff' : '#f8fafc',
                    borderRadius: '8px',
                    border: `1px solid ${index === 0 ? '#bfdbfe' : '#e5e7eb'}`
                  }}
                >
                  <div>
                    <div style={{
                      fontWeight: '500',
                      color: '#1f2937',
                      fontSize: '14px'
                    }}>
                      {domain.domain || 'Unknown Domain'}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      #{index + 1} most active
                    </div>
                  </div>
                  
                  <div style={{
                    background: index === 0 ? '#3b82f6' : '#6b7280',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {domain.count} loads
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
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
            🔥 Recent Activity
          </h3>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            {analytics.recentActivity.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <p>No recent activity</p>
              </div>
            ) : (
              analytics.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px 16px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px'
                  }}>
                    <div style={{
                      fontWeight: '500',
                      color: '#1f2937',
                      fontSize: '14px'
                    }}>
                      {getActivityIcon(activity.type)} {formatActivityType(activity.type)}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}>
                      {new Date(activity.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {activity.user_email}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        marginTop: '32px'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '24px'
        }}>
          ⚡ Platform Health
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          <HealthMetric
            label="API Response Time"
            value="< 200ms"
            status="good"
            icon="🚀"
          />
          
          <HealthMetric
            label="Widget Load Time"
            value="< 1s"
            status="good"
            icon="⚡"
          />
          
          <HealthMetric
            label="Database Performance"
            value="Optimal"
            status="good"
            icon="💾"
          />
          
          <HealthMetric
            label="Error Rate"
            value="< 0.1%"
            status="good"
            icon="✅"
          />
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
  growth, 
  subtitle 
}: { 
  title: string
  value: string | number
  icon: string
  color: string
  growth?: number
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
        marginBottom: growth !== undefined ? '4px' : 0
      }}>
        {title}
      </div>
      {growth !== undefined && (
        <div style={{
          fontSize: '12px',
          color: growth > 0 ? '#10b981' : '#dc2626',
          fontWeight: '500'
        }}>
          {growth > 0 ? '↗️' : '↘️'} {Math.abs(growth)} this month
        </div>
      )}
      {subtitle && (
        <div style={{
          color: '#9ca3af',
          fontSize: '12px',
          marginTop: '4px'
        }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}

function HealthMetric({ 
  label, 
  value, 
  status, 
  icon 
}: { 
  label: string
  value: string
  status: 'good' | 'warning' | 'error'
  icon: string 
}) {
  const statusColors = {
    good: '#10b981',
    warning: '#f59e0b',
    error: '#dc2626'
  }

  return (
    <div style={{
      textAlign: 'center',
      padding: '16px',
      background: status === 'good' ? '#f0fdf4' : status === 'warning' ? '#fefce8' : '#fef2f2',
      borderRadius: '8px',
      border: `1px solid ${status === 'good' ? '#bbf7d0' : status === 'warning' ? '#fde047' : '#fca5a5'}`
    }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <div style={{
        fontSize: '18px',
        fontWeight: '600',
        color: statusColors[status],
        marginBottom: '4px'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '12px',
        color: '#6b7280'
      }}>
        {label}
      </div>
    </div>
  )
}

// Helper Functions
function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    'testimonial_submit': '💬',
    'widget_load': '🎨',
    'user_signup': '👋',
    'form_view': '👀',
    'testimonial_approved': '✅',
    'widget_click': '🖱️'
  }
  return icons[type] || '📊'
}

function formatActivityType(type: string): string {
  const formats: Record<string, string> = {
    'testimonial_submit': 'Testimonial Submitted',
    'widget_load': 'Widget Loaded',
    'user_signup': 'New User Signup',
    'form_view': 'Collection Form Viewed',
    'testimonial_approved': 'Testimonial Approved',
    'widget_click': 'Widget Clicked'
  }
  return formats[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}