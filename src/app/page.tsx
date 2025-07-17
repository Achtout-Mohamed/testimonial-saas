'use client'
import { useEffect, useState } from 'react'
import { createSupabaseComponentClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

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
          <h1>🎉 Testimonial SaaS</h1>
          <p>The easiest way to collect and display customer testimonials</p>
          <p style={{ fontSize: '16px', opacity: '0.9', marginTop: '8px' }}>
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
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  📊 Go to Dashboard
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
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  🎨 Widget Generator
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  🚀 Get Started Free
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
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  👋 Sign In
                </a>
              </>
            )}
          </div>

          <div style={{ marginTop: '40px', fontSize: '14px', opacity: '0.8' }}>
            <p>✨ Free Forever Plan Includes:</p>
            <p>• 10 testimonials • 1 website widget • Email support</p>
            <p>• Contact us for unlimited testimonials!</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}