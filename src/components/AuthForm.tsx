'use client'
import { useState } from 'react'
import { createSupabaseComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'
import { Icon } from '@/components/Icon'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createSupabaseComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signup') {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name
            }
          }
        })

        if (error) {
          setMessage(error.message)
        } else {
          // Track successful signup
          trackEvent.userSignup('email')
          setMessage('Please check your email to confirm your account!')
        }
      } else {
        // Log in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          setMessage(error.message)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Icon 
              name={mode === 'signup' ? 'rocket' : 'login'} 
              size={48} 
              color="#3b82f6" 
            />
          </div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ color: '#6b7280' }}>
            {mode === 'signup' 
              ? 'Start collecting testimonials today' 
              : 'Sign in to your testimonial dashboard'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '8px'
              }}>
                <Icon name="user" size={16} />
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '8px'
            }}>
              <Icon name="email" size={16} />
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '8px'
            }}>
              <Icon name="lock" size={16} />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          {message && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: message.includes('error') || message.includes('Invalid') ? '#fef2f2' : '#f0f9ff',
              color: message.includes('error') || message.includes('Invalid') ? '#dc2626' : '#0369a1',
              fontSize: '14px',
              border: `1px solid ${message.includes('error') || message.includes('Invalid') ? '#fca5a5' : '#93c5fd'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Icon 
                name={message.includes('error') || message.includes('Invalid') ? 'error' : 'info'} 
                size={16} 
              />
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              padding: '14px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <Icon name="loading" size={16} />
                Please wait...
              </>
            ) : (
              <>
                <Icon name={mode === 'signup' ? 'signup' : 'login'} size={16} />
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px',
          padding: '16px 0',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px' 
          }}>
            <Icon name="help" size={14} />
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
            {' '}
            <a 
              href={mode === 'signup' ? '/auth/login' : '/auth/signup'}
              style={{ 
                color: '#3b82f6', 
                textDecoration: 'none', 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Icon name={mode === 'signup' ? 'login' : 'signup'} size={12} />
              {mode === 'signup' ? 'Sign in' : 'Sign up'}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}