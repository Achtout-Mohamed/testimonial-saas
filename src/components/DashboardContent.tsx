'use client'
import { useEffect, useState } from 'react'
import { createSupabaseComponentClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const supabase = createSupabaseComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        loadTestimonials(user.id)
        getTestimonialCount(user.id)
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
              📊 Testimonial Dashboard
            </h1>
            <p style={{ color: '#6b7280' }}>
              Welcome back, {user?.user_metadata?.name || user?.email}!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => router.push('/dashboard/widget')}
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

        {/* Collection Link */}
        <div style={{ 
          background: 'white', 
          padding: '20px 30px', 
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          marginBottom: '30px'
        }}>
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
            color: '#374151'
          }}>
            {`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/collect/${user?.id}`}
          </div>
          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '8px' }}>
            Share this link with your customers to collect testimonials
          </p>
        </div>

        {/* Usage Tracking */}
        <div style={{ 
          background: 'white', 
          padding: '20px 30px', 
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          marginBottom: '30px'
        }}>
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
          
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
              🎯 Ready to Upgrade? Get in Touch!
            </h4>
            
            <div style={{ 
              background: '#f8fafc', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ fontSize: '14px', color: '#374151', marginBottom: '12px', fontWeight: '500' }}>
                Contact us to unlock unlimited testimonials:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>📧</span>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Email:</span>
                  <a 
                    href={`mailto:achtoutmohamed08@gmail.com?subject=Testimonial SaaS Upgrade&body=Hi, I'd like to upgrade my account (${user?.email}) to unlimited testimonials.`}
                    style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
                  >
                    achtoutmohamed08@gmail.com
                  </a>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>📱</span>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>WhatsApp:</span>
                  <a 
                    href="https://wa.me/212611110589?text=Hi%2C%20I%27m%20interested%20in%20upgrading%20my%20testimonial%20account"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#10b981', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
                  >
                    +212 611110589
                  </a>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>⚡</span>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Response time:</span>
                  <span style={{ fontSize: '14px', color: '#059669', fontWeight: '500' }}>
                    Within 24 hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
              {stats.total}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Testimonials</div>
          </div>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669', marginBottom: '4px' }}>
              {stats.approved}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Approved</div>
          </div>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626', marginBottom: '4px' }}>
              {stats.pending}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Pending Review</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ marginBottom: '30px' }}>
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
        <div style={{ display: 'grid', gap: '20px' }}>
          {filteredTestimonials.length === 0 ? (
            <div style={{ 
              background: 'white', 
              padding: '60px 20px', 
              borderRadius: '12px', 
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <h3 style={{ color: '#6b7280', fontSize: '18px', marginBottom: '8px' }}>
                {filter === 'all' ? 'No testimonials yet' : `No ${filter} testimonials`}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                Share your collection link with customers to start collecting testimonials
              </p>
            </div>
          ) : (
            filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                border: testimonial.approved ? '2px solid #d1fae5' : '2px solid #fef3c7'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                      {testimonial.customer_name}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                      {testimonial.customer_email}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div>
                        {'⭐'.repeat(testimonial.rating)}
                      </div>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        ({testimonial.rating}/5)
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!testimonial.approved && (
                      <button
                        onClick={() => approveTestimonial(testimonial.id)}
                        style={{
                          background: '#059669',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        ✓ Approve
                      </button>
                    )}
                    
                    {testimonial.approved && (
                      <button
                        onClick={() => rejectTestimonial(testimonial.id)}
                        style={{
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        ✗ Reject
                      </button>
                    )}
                    
                    <span style={{
                      background: testimonial.approved ? '#d1fae5' : '#fef3c7',
                      color: testimonial.approved ? '#065f46' : '#92400e',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {testimonial.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
                
                <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '12px' }}>
                  "{testimonial.message}"
                </p>
                
                <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                  Submitted: {new Date(testimonial.created_at).toLocaleDateString()} at {new Date(testimonial.created_at).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}