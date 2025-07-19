'use client'
import { useEffect, useState } from 'react'
import { createSupabaseComponentClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Icon } from '@/components/Icon'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createSupabaseComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <div>
      <Navigation />
      
      <div className="homepage">
        <div>
          <h1 style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <Icon name="logo" size={56} color="white" />
            Testimonial SaaS
          </h1>
          <p style={{ fontSize: '16px', opacity: '0.9', marginTop: '8px' }}>
            The easiest way to collect and display customer testimonials
          </p>
          <p style={{ fontSize: '16px', opacity: '0.9', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Icon name="rocket" size={16} color="white" />
            Start free - 10 testimonials included!
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            justifyContent: 'center',
            marginTop: '32px'
          }}>
            {user ? (
              <>
                <a
                  href="/dashboard"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    border: '1px solid rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Icon name="dashboard" size={18} color="white" />
                  Go to Dashboard
                </a>
                <a
                  href="/dashboard/widget"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    border: '1px solid rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Icon name="widget" size={18} color="white" />
                  Widget Generator
                </a>
              </>
            ) : (
              <>
                <a
                  href="/auth/signup"
                  style={{
                    background: 'white',
                    color: '#667eea',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Icon name="rocket" size={18} color="#667eea" />
                  Get Started Free
                </a>
                <a
                  href="/auth/login"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    border: '1px solid rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Icon name="login" size={18} color="white" />
                  Sign In
                </a>
              </>
            )}
          </div>

          <div style={{ marginTop: '40px', fontSize: '14px', opacity: '0.8' }}>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Icon name="features" size={16} color="white" />
              Free Forever Plan Includes:
            </p>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icon name="testimonials" size={14} color="white" />
                10 testimonials
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icon name="widget" size={14} color="white" />
                1 website widget
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icon name="support" size={14} color="white" />
                Email support
              </span>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Icon name="contact" size={16} color="white" />
              Contact us for unlimited testimonials!
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}