'use client'
import { useState } from 'react'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log('Submitting testimonial:', formData)
      
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId
        })
      })

      if (response.ok) {
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
          <div className="success-message">Thank You! 🎉</div>
          <p className="success-text">
            Your testimonial has been submitted successfully and will be reviewed shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="form-title">Share Your Experience</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Name *</label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              className="form-input"
              placeholder="Enter your full name"
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              required
              value={formData.customerEmail}
              onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
              className="form-input"
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rating *</label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
              className="form-input"
            >
              <option value={5}>⭐⭐⭐⭐⭐ Excellent (5/5)</option>
              <option value={4}>⭐⭐⭐⭐ Very Good (4/5)</option>
              <option value={3}>⭐⭐⭐ Good (3/5)</option>
              <option value={2}>⭐⭐ Fair (2/5)</option>
              <option value={1}>⭐ Poor (1/5)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Your Testimonial *</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Tell us about your experience in detail..."
              className="form-input form-textarea"
              minLength={10}
              maxLength={500}
            />
            <div className="character-counter">
              {formData.message.length}/500 characters
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || formData.message.length < 10}
            className="btn-primary"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
          </button>
        </form>
      </div>
    </div>
  )
}