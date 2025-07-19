'use client'
import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { trackEvent } from '@/lib/analytics'
import { Icon, WhatsAppIcon, EmailIcon } from '@/components/Icon'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Track page view
  useEffect(() => {
    trackEvent.contactFormViewed()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        // Track successful contact form submission
        trackEvent.contactFormSubmitted(formData.subject)
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setError(data.error || 'Failed to send message')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div>
      <Navigation />
      
      <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
        {/* Hero Section */}
        <section style={{
          padding: '80px 20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '24px',
              lineHeight: '1.2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <Icon name="contact" size={48} color="white" />
              Get in Touch
            </h1>
            <p style={{
              fontSize: '20px',
              opacity: 0.9,
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              Have questions? Need help? Want to upgrade? We're here to help you succeed.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '48px'
          }}>
            
            {/* Contact Info */}
            <div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Icon name="message" size={32} color="#3b82f6" />
                Let's Talk
              </h2>
              
              <p style={{
                fontSize: '18px',
                color: '#6b7280',
                lineHeight: '1.6',
                marginBottom: '32px'
              }}>
                Whether you need help setting up, want to upgrade your plan, or have questions 
                about our features, we're here to help.
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#3b82f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon name="email" size={20} color="white" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      Email Us
                    </h3>
                    <a
                      href="mailto:achtoutmohamed08@gmail.com"
                      style={{
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontSize: '16px'
                      }}>
                     achtoutmohamed08@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#25d366',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon name="whatsapp" size={20} color="white" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      WhatsApp
                    </h3>
                    <a
                      href="https://wa.me/212611110589?text=Hi%2C%20I%20have%20a%20question%20about%20TestimonialPro"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#25d366',
                        textDecoration: 'none',
                        fontSize: '16px'
                      }}
                    >
                      +212 611 110 589
                    </a>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#10b981',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon name="fast" size={20} color="white" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      Response Time
                    </h3>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '16px',
                      margin: 0
                    }}>
                      Within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Icon name="message" size={24} color="#3b82f6" />
                Send us a Message
              </h2>

              {submitted ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px'
                }}>
                  <div style={{
                    marginBottom: '24px'
                  }}>
                    <Icon name="success" size={64} color="#10b981" />
                  </div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#10b981',
                    marginBottom: '16px'
                  }}>
                    Message Sent!
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '16px',
                    marginBottom: '24px'
                  }}>
                    Thanks for reaching out! We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      margin: '0 auto'
                    }}
                  >
                    <Icon name="edit" size={14} />
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#dc2626',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Icon name="error" size={16} />
                      {error}
                    </div>
                  )}

                  <div style={{
                    display: 'grid',
                    gap: '20px'
                  }}>
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
                        <Icon name="user" size={14} />
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '16px',
                          transition: 'border-color 0.2s',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        placeholder="Your name"
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
                        <Icon name="email" size={14} />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '16px',
                          transition: 'border-color 0.2s',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        placeholder="your@email.com"
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
                        <Icon name="tag" size={14} />
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '16px',
                          transition: 'border-color 0.2s',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="">Select a subject</option>
                        <option value="upgrade">Upgrade My Plan</option>
                        <option value="support">Technical Support</option>
                        <option value="question">General Question</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
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
                        <Icon name="message" size={14} />
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '16px',
                          transition: 'border-color 0.2s',
                          outline: 'none',
                          resize: 'vertical',
                          boxSizing: 'border-box'
                        }}
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '16px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Icon name="loading" size={16} />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Icon name="send" size={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}