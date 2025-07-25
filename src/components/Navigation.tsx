'use client'
import { useState, useEffect } from 'react'
import { createSupabaseComponentClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Icon } from '@/components/Icon'

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = createSupabaseComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '0 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px'
      }}>
        
        {/* Logo */}
        <a href="/" style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#3b82f6',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Icon name="logo" size={28} color="#3b82f6" />
          TestimonialPro
        </a>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }}>
          <div style={{
            display: 'flex',
            gap: '24px'
          }}>
            <a href="/features" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Icon name="features" size={16} />
              Features
            </a>
            <a href="/pricing" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Icon name="pricing" size={16} />
              Pricing
            </a>
            <a href="/about" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Icon name="about" size={16} />
              About
            </a>
            <a href="/contact" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Icon name="contact" size={16} />
              Contact
            </a>
          </div>

          {/* Auth Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            {user ? (
              <a
                href="/dashboard"
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Icon name="dashboard" size={16} />
                Dashboard
              </a>
            ) : (
              <>
                <a
                  href="/auth/login"
                  style={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Icon name="login" size={16} />
                  Sign In
                </a>
                <a
                  href="/auth/signup"
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Icon name="rocket" size={16} />
                  Start Free
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}