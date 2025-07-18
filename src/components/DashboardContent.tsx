// src/components/DashboardContent.tsx - Enhanced with Analytics
'use client'
import { useEffect, useState } from 'react'
import { createSupabaseComponentClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { usePageTracking, trackEvent } from '@/lib/analytics'
import AnalyticsDashboard from './AnalyticsDashboard'

interface Testimonial {
  id: string
  customer_name: string
  customer_email: string
  message: string
  rating: number
  approved: boolean
  created_at: string
}

export default function DashboardContent() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all')
  const [user, setUser] = useState<User | null>(null)
  const [testimonialCount, setTestimonialCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'testimonials' | 'analytics'>('overview')
  const router = useRouter()
  const supabase = createSupabaseComponentClient()

  // Track page view
  usePageTracking(user, 'dashboard_main')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        loadTestimonials(user.id)
        getTestimonialCount(user.id)
        // Track dashboard view
        trackEvent.dashboardViewed()
      }
    }
    getUser()
  }, [])

  const loadTestimonials = async (userId: string) => {
    try {
      console.log('Loading testimonials for user:', userId)
      
      const response = await fetch(`/api/admin/testimonials?userId=${userId}`)
      const data = await response.json()
      
      console.log('API response:', data)
      
      if (Array.isArray(data)) {
        setTestimonials(data)
      } else {
        console.error('Unexpected response format:', data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTestimonialCount = async (userId: string) => {
    try {
      const response = await fetch(`/api/usage/testimonials?userId=${userId}`)
      const data = await response.json()
      setTestimonialCount(data.count)
    } catch (error) {
      console.error('Error getting testimonial count:', error)
    }
  }

  const approveTestimonial = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true })
      })

      if (response.ok) {
        loadTestimonials(user!.id)
        
        // Track approval action in Vercel Analytics
        trackEvent.testimonialApproved(id)
        
        // Track approval action in internal analytics
        await fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user!.id,
            eventType: 'testimonial_action',
            eventName: 'testimonial_approved',
            properties: { testimonialId: id }
          })
        })
      } else {
        console.error('Error approving testimonial')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const rejectTestimonial = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: false })
      })

      if (response.ok) {
        loadTestimonials(user!.id)
        
        // Track rejection action in Vercel Analytics
        trackEvent.testimonialRejected(id)
        
        // Track rejection action in internal analytics
        await fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user!.id,
            eventType: 'testimonial_action',
            eventName: 'testimonial_rejected',
            properties: { testimonialId: id }
          })
        })
      } else {
        console.error('Error rejecting testimonial')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const handleTabChange = (tab: 'overview' | 'testimonials' | 'analytics') => {
    setActiveTab(tab)
    // Track tab changes
    trackEvent.dashboardViewed()
  }

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'approved') return t.approved
    if (filter === 'pending') return !t.approved
    return true
  })

  const stats = {
    total: testimonials.length,
    approved: testimonials.filter(t => t.approved).length,
    pending: testimonials.filter(t => !t.approved).length
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc'
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
          <p style={{ color: '#6b7280' }}>Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header with User Info */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px',
          background: 'white',
          padding: '20px 30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
              📊 Dashboard
            </h1>
            <p style={{ color: '#6b7280' }}>
              Welcome back, {user?.user_metadata?.name || user?.email}!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => {
                trackEvent.widgetGenerated('dashboard_click', testimonials.length)
                router.push('/dashboard/widget')
              }}
              style={{
                background: '#e5e7eb',
                color: '#374151',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              🎨 Widget Generator
            </button>
            
            <button
              onClick={handleSignOut}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'white',
          padding: '20px 30px 0',
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          marginBottom: '0'
        }}>
          <div style={{
            display: 'flex',
            gap: '24px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {[
              { id: 'overview', label: '📋 Overview', icon: '📋' },
              { id: 'testimonials', label: '💬 Testimonials', icon: '💬' },
              { id: 'analytics', label: '📊 Analytics', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 0',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                  borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '0 0 12px 12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          minHeight: '500px'
        }}>
          {activeTab === 'overview' && (
            <div>
              {/* Collection Link */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  📎 Your Collection Link
                </h3>
                <div style={{ 
                  background: '#f8fafc', 
                  padding: '12px 16px', 
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  color: '#374151',
                  wordBreak: 'break-all'
                }}>
                  {`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/collect/${user?.id}`}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '8px'
                }}>
                  <button
                    onClick={() => {
                      const link = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/collect/${user?.id}`
                      navigator.clipboard.writeText(link)
                      alert('Collection link copied to clipboard!')
                    }}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    📋 Copy Link
                  </button>
                  <a
                    href={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/collect/${user?.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                  >
                    🔗 Test Link
                  </a>
                </div>
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '8px' }}>
                  Share this link with your customers to collect testimonials
                </p>
              </div>

              {/* Usage Tracking */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  📊 Your Usage (Free Plan)
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>Testimonials</span>
                    <span style={{ color: '#374151', fontWeight: '500' }}>
                      {testimonialCount}/10
                    </span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    background: '#e5e7eb', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${Math.min((testimonialCount / 10) * 100, 100)}%`, 
                      height: '100%', 
                      background: testimonialCount >= 10 ? '#dc2626' : '#3b82f6',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>
                
                {testimonialCount >= 10 && (
                  <div style={{ 
                    background: '#fef3c7', 
                    border: '1px solid #f59e0b',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginTop: '12px'
                  }}>
                    <p style={{ color: '#92400e', fontSize: '14px', margin: 0 }}>
                      ⚠️ You've reached your free plan limit. 
                      <strong> Contact us to upgrade for unlimited testimonials!</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
                    {stats.total}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Testimonials</div>
                </div>
                
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669', marginBottom: '4px' }}>
                    {stats.approved}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>Approved</div>
                </div>
                
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626', marginBottom: '4px' }}>
                    {stats.pending}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>Pending Review</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  🚀 Quick Actions
                </h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      trackEvent.widgetGenerated('overview_click', stats.approved)
                      router.push('/dashboard/widget')
                    }}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    🎨 Generate Widget
                  </button>
                  <a
                    href="/contact"
                    style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    💬 Upgrade Plan
                  </a>
                  <button
                    onClick={() => handleTabChange('testimonials')}
                    style={{
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    📝 Manage Testimonials
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Manage Testimonials
                </h3>
                
                {/* Filter Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  {(['all', 'approved', 'pending'] as const).map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      style={{
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        background: filter === filterType ? '#3b82f6' : '#e5e7eb',
                        color: filter === filterType ? 'white' : '#374151',
                        transition: 'all 0.2s'
                      }}
                    >
                      {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Testimonials List */}
              <div style={{ display: 'grid', gap: '16px' }}>
                {filteredTestimonials.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#6b7280'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                    <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                      {filter === 'all' ? 'No testimonials yet' : `No ${filter} testimonials`}
                    </h3>
                    <p style={{ fontSize: '14px' }}>
                      Share your collection link to start gathering testimonials!
                    </p>
                  </div>
                ) : (
                  filteredTestimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      onApprove={() => approveTestimonial(testimonial.id)}
                      onReject={() => rejectTestimonial(testimonial.id)}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && user && (
            <AnalyticsDashboard user={user} />
          )}
        </div>
      </div>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ 
  testimonial, 
  onApprove, 
  onReject 
}: { 
  testimonial: Testimonial
  onApprove: () => void
  onReject: () => void 
}) {
  return (
    <div style={{
      background: testimonial.approved ? '#f0fdf4' : '#fef3c7',
      border: `1px solid ${testimonial.approved ? '#bbf7d0' : '#fde047'}`,
      padding: '20px',
      borderRadius: '12px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div>
          <h4 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '4px'
          }}>
            {testimonial.customer_name}
          </h4>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '8px'
          }}>
            {testimonial.customer_email}
          </p>
          <div style={{
            color: '#fbbf24',
            fontSize: '16px'
          }}>
            {'⭐'.repeat(testimonial.rating)}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            background: testimonial.approved ? '#10b981' : '#f59e0b',
            color: 'white'
          }}>
            {testimonial.approved ? 'Approved' : 'Pending'}
          </span>
          
          {!testimonial.approved && (
            <>
              <button
                onClick={onApprove}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                ✓ Approve
              </button>
              <button
                onClick={onReject}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                ✗ Reject
              </button>
            </>
          )}
        </div>
      </div>
      
      <p style={{
        color: '#374151',
        lineHeight: '1.6',
        marginBottom: '12px',
        fontStyle: 'italic'
      }}>
        "{testimonial.message}"
      </p>
      
      <div style={{
        fontSize: '12px',
        color: '#9ca3af'
      }}>
        Submitted: {new Date(testimonial.created_at).toLocaleDateString()} at {new Date(testimonial.created_at).toLocaleTimeString()}
      </div>
    </div>
  )
}