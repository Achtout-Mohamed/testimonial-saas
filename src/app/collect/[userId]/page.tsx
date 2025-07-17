// src/app/collect/[userId]/page.tsx - Enhanced with Analytics
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function CollectTestimonial() {
  const params = useParams()
  const userId = params.userId as string
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    message: '',
    rating: 5
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hasStartedForm, setHasStartedForm] = useState(false)

  // Analytics tracking
  useEffect(() => {
    // Track form view when page loads
    trackAnalytics('form_view', userId)
  }, [userId])

  const trackAnalytics = async (eventType: string, targetUserId: string, additionalData?: any) => {
    try {
      await fetch('/api/analytics/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUserId,
          eventType,
          formData: additionalData,
          referrer: document.referrer,
          sessionId: getSessionId()
        })
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('testimonial_session')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('testimonial_session', sessionId)
    }
    return sessionId
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Track when user starts filling the form
    if (!hasStartedForm && (field === 'customerName' || field === 'customerEmail') && value) {
      setHasStartedForm(true)
      trackAnalytics('form_start', userId)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log('Submitting testimonial:', formData)
      
      // Track form submission attempt
      await trackAnalytics('form_submit', userId, {
        rating: formData.rating,
        messageLength: formData.message.length,
        hasEmail: !!formData.customerEmail,
        hasName: !!formData.customerName
      })
      
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Track successful completion
        await trackAnalytics('form_complete', userId, {
          testimonialId: result.data?.[0]?.id,
          rating: formData.rating,
          messageLength: formData.message.length
        })
        
        setIsSubmitted(true)
      } else {
        const error = await response.text()
        console.error('Server error:', error)
        alert('Error submitting testimonial. Please try again.')
      }
    } catch (error) {
      console.error('Network error:', error)
      alert('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="container">
        <div className="success-container">
          <div style={{
            fontSize: '64px',
            marginBottom: '24px',
            animation: 'bounce 1s ease-in-out'
          }}>
            🎉
          </div>
          <div className="success-message">Thank You!</div>
          <p className="success-text">
            Your testimonial has been submitted successfully and will be reviewed shortly.
          </p>
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '24px',
            textAlign: 'left'
          }}>
            <h4 style={{
              color: '#1e40af',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              What happens next?
            </h4>
            <ul style={{
              color: '#1e40af',
              fontSize: '14px',
              lineHeight: '1.6',
              paddingLeft: '20px',
              margin: 0
            }}>
              <li>We'll review your testimonial within 24 hours</li>
              <li>Once approved, it will appear on the business website</li>
              <li>You may receive a follow-up email if we need clarification</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="form-container">
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            ⭐
          </div>
          <h1 className="form-title">Share Your Experience</h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Your feedback helps others make informed decisions and helps us improve our service.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Name *</label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className="form-input"
              placeholder="Enter your full name"
              minLength={2}
              style={{
                transition: 'all 0.2s',
                borderColor: formData.customerName ? '#10b981' : '#e5e7eb'
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              required
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              className="form-input"
              placeholder="your@email.com"
              style={{
                transition: 'all 0.2s',
                borderColor: formData.customerEmail ? '#10b981' : '#e5e7eb'
              }}
            />
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px'
            }}>
              📧 We'll only use this to contact you if needed
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Rating *</label>
            <div style={{
              display: 'grid',
              gap: '8px',
              marginBottom: '8px'
            }}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    border: `2px solid ${formData.rating === rating ? '#3b82f6' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: formData.rating === rating ? '#f0f9ff' : 'transparent'
                  }}
                >
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={formData.rating === rating}
                    onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
                    style={{ margin: 0 }}
                  />
                  <span style={{ fontSize: '18px' }}>
                    {'⭐'.repeat(rating)}
                  </span>
                  <span style={{
                    fontWeight: '500',
                    color: formData.rating === rating ? '#1e40af' : '#374151'
                  }}>
                    {rating === 5 ? 'Excellent' : 
                     rating === 4 ? 'Very Good' : 
                     rating === 3 ? 'Good' : 
                     rating === 2 ? 'Fair' : 'Poor'} ({rating}/5)
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Testimonial *</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Tell us about your experience in detail..."
              className="form-input form-textarea"
              minLength={10}
              maxLength={500}
              style={{
                transition: 'all 0.2s',
                borderColor: formData.message.length >= 10 ? '#10b981' : '#e5e7eb'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px'
            }}>
              <div className="character-counter">
                {formData.message.length}/500 characters
              </div>
              {formData.message.length >= 10 && (
                <div style={{
                  fontSize: '12px',
                  color: '#10b981',
                  fontWeight: '500'
                }}>
                  ✓ Looking good!
                </div>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div style={{
            background: '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Form Progress
              </span>
              <span style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                {getCompletionPercentage()}% complete
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: '#e5e7eb',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${getCompletionPercentage()}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || formData.message.length < 10}
            className="btn-primary"
            style={{
              opacity: (isSubmitting || formData.message.length < 10) ? 0.6 : 1,
              transform: 'none',
              boxShadow: (isSubmitting || formData.message.length < 10) ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Submitting...
              </span>
            ) : 'Submit Testimonial'}
          </button>
        </form>
        
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          padding: '16px',
          background: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#1e40af',
            lineHeight: '1.5'
          }}>
            🔒 <strong>Your privacy matters:</strong> We will never share your personal information without permission.
          </div>
        </div>
      </div>
    </div>
  )

  function getCompletionPercentage(): number {
    let completed = 0
    const total = 4
    
    if (formData.customerName.length >= 2) completed++
    if (formData.customerEmail.includes('@')) completed++
    if (formData.rating > 0) completed++
    if (formData.message.length >= 10) completed++
    
    return Math.round((completed / total) * 100)
  }
}