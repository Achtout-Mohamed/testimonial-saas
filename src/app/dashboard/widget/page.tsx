'use client'
import { useState, useEffect } from 'react'
import { createSupabaseComponentClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import ProtectedRoute from '@/components/ProtectedRoute'

interface Testimonial {
  id: string
  customer_name: string
  customer_email: string
  message: string
  rating: number
  created_at: string
}

function WidgetGeneratorContent() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [settings, setSettings] = useState({
    maxTestimonials: 3,
    showEmail: false,
    theme: 'light'
  })
  const supabase = createSupabaseComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        loadApprovedTestimonials(user.id)
      }
    }
    getUser()
  }, [])

  const loadApprovedTestimonials = async (userId: string) => {
    try {
      const response = await fetch(`/api/testimonials/widget?userId=${userId}&limit=${settings.maxTestimonials}`)
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setTestimonials(data)
      }
    } catch (error) {
      console.error('Error loading testimonials:', error)
    }
  }

  useEffect(() => {
    if (user) {
      loadApprovedTestimonials(user.id)
    }
  }, [settings.maxTestimonials, user])

  const generateWidgetCode = () => {
    if (!user) return ''
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    return `<!-- Testimonial Widget -->
<div id="testimonial-widget-${user.id}"></div>
<script>
(function() {
  const widgetId = 'testimonial-widget-${user.id}';
  const apiUrl = '${baseUrl}/api/testimonials/widget?userId=${user.id}&limit=${settings.maxTestimonials}';
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(testimonials => {
      const widget = document.getElementById(widgetId);
      if (!widget) return;
      
      const widgetHTML = \`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
          <h3 style="color: #1f2937; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
            What Our Customers Say
          </h3>
          <div style="display: grid; gap: 16px;">
            \${testimonials.map(t => \`
              <div style="background: ${settings.theme === 'dark' ? '#1f2937' : '#ffffff'}; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid ${settings.theme === 'dark' ? '#374151' : '#e5e7eb'};">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <div style="color: #fbbf24;">\${'⭐'.repeat(t.rating)}</div>
                  <span style="margin-left: 8px; font-weight: 600; color: ${settings.theme === 'dark' ? '#f9fafb' : '#1f2937'};">\${t.customer_name}</span>
                  ${settings.showEmail ? `<span style="margin-left: 8px; color: #6b7280; font-size: 14px;">(\${t.customer_email})</span>` : ''}
                </div>
                <p style="color: ${settings.theme === 'dark' ? '#d1d5db' : '#374151'}; line-height: 1.6; margin: 0;">
                  "\${t.message}"
                </p>
                <div style="margin-top: 8px; font-size: 12px; color: #9ca3af;">
                  \${new Date(t.created_at).toLocaleDateString()}
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
      
      widget.innerHTML = widgetHTML;
    })
    .catch(error => {
      console.error('Error loading testimonials:', error);
      document.getElementById(widgetId).innerHTML = '<p style="color: #ef4444;">Error loading testimonials</p>';
    });
})();
</script>`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Widget code copied to clipboard!')
    })
  }

  const goToDashboard = () => {
    window.location.href = '/dashboard'
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
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
              🎨 Widget Generator
            </h1>
            <p style={{ color: '#6b7280' }}>Create embed code to display testimonials on your website</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={goToDashboard}
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
              📊 Dashboard
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
            {`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/collect/${user?.id || 'loading...'}`}
          </div>
          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '8px' }}>
            Share this link with your customers to collect testimonials
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          
          {/* Settings Panel */}
          <div>
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                ⚙️ Widget Settings
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Number of Testimonials
                </label>
                <select
                  value={settings.maxTestimonials}
                  onChange={(e) => setSettings({...settings, maxTestimonials: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value={1}>1 testimonial</option>
                  <option value={2}>2 testimonials</option>
                  <option value={3}>3 testimonials</option>
                  <option value={5}>5 testimonials</option>
                  <option value={10}>10 testimonials</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({...settings, theme: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.showEmail}
                    onChange={(e) => setSettings({...settings, showEmail: e.target.checked})}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontWeight: '500', color: '#374151' }}>Show customer email addresses</span>
                </label>
              </div>
            </div>

            {/* Widget Code */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                📋 Widget Code
              </h2>
              
              <textarea
                readOnly
                value={generateWidgetCode()}
                style={{
                  width: '100%',
                  height: '200px',
                  padding: '16px',
                  background: '#f8fafc',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  resize: 'none'
                }}
              />
              
              <button
                onClick={() => copyToClipboard(generateWidgetCode())}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '16px',
                  width: '100%'
                }}
              >
                📋 Copy Widget Code
              </button>
              
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '12px' }}>
                Copy this code and paste it anywhere on your website where you want testimonials to appear.
              </p>
            </div>
          </div>

          {/* Preview Panel */}
          <div>
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                👀 Live Preview
              </h2>
              
              {testimonials.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                  <p>No approved testimonials yet.</p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>
                    Go to the dashboard to approve some testimonials first.
                  </p>
                  <button
                    onClick={goToDashboard}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      marginTop: '12px'
                    }}
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <div style={{ 
                  background: settings.theme === 'dark' ? '#1f2937' : '#ffffff',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{ color: settings.theme === 'dark' ? '#f9fafb' : '#1f2937', marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
                    What Our Customers Say
                  </h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {testimonials.slice(0, settings.maxTestimonials).map((testimonial) => (
                      <div key={testimonial.id} style={{
                        background: settings.theme === 'dark' ? '#374151' : '#f8fafc',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid ' + (settings.theme === 'dark' ? '#4b5563' : '#e5e7eb')
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                          <div style={{ color: '#fbbf24' }}>
                            {'⭐'.repeat(testimonial.rating)}
                          </div>
                          <span style={{ 
                            marginLeft: '8px', 
                            fontWeight: '600', 
                            color: settings.theme === 'dark' ? '#f9fafb' : '#1f2937' 
                          }}>
                            {testimonial.customer_name}
                          </span>
                          {settings.showEmail && (
                            <span style={{ marginLeft: '8px', color: '#6b7280', fontSize: '14px' }}>
                              ({testimonial.customer_email})
                            </span>
                          )}
                        </div>
                        <p style={{ 
                          color: settings.theme === 'dark' ? '#d1d5db' : '#374151', 
                          lineHeight: '1.6', 
                          margin: '0' 
                        }}>
                          "{testimonial.message}"
                        </p>
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af' }}>
                          {new Date(testimonial.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WidgetGenerator() {
  return (
    <ProtectedRoute>
      <WidgetGeneratorContent />
    </ProtectedRoute>
  )
}