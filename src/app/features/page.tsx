'use client'
import { useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { trackEvent } from '@/lib/analytics'
import { Icon } from '@/components/Icon'

export default function FeaturesPage() {
  const features = [
    {
      iconName: 'target' as const,
      title: 'Simple Collection',
      description: 'Send customers a single link to collect testimonials instantly. No complicated forms or processes.',
      details: [
        'One-click testimonial collection',
        'Mobile-friendly forms',
        'Customizable fields',
        'Automatic email notifications'
      ]
    },
    {
      iconName: 'settings' as const,
      title: 'Easy Management',
      description: 'Approve, reject, and organize testimonials from your dashboard. Full control over what gets displayed.',
      details: [
        'Approve/reject testimonials',
        'Filter by status',
        'Search and organize',
        'Bulk actions'
      ]
    },
    {
      iconName: 'widget' as const,
      title: 'Beautiful Widgets',
      description: 'Generate embed codes to display testimonials on your website. Matches your brand perfectly.',
      details: [
        'Customizable themes',
        'Responsive design',
        'Easy embed code',
        'Multiple layouts'
      ]
    },
    {
      iconName: 'analytics' as const,
      title: 'Smart Analytics',
      description: 'Track testimonial collection and see which ones perform best. Make data-driven decisions.',
      details: [
        'Collection metrics',
        'Conversion tracking',
        'Performance insights',
        'Export data'
      ]
    },
    {
      iconName: 'secure' as const,
      title: 'Secure & Reliable',
      description: 'Your testimonials are safe with enterprise-grade security and 99.9% uptime guarantee.',
      details: [
        'SSL encryption',
        'Data backup',
        'GDPR compliant',
        'Reliable hosting'
      ]
    },
    {
      iconName: 'fast' as const,
      title: 'Fast Setup',
      description: 'Get started in minutes, not hours. No technical skills required to collect testimonials.',
      details: [
        '5-minute setup',
        'No coding required',
        'Instant deployment',
        'Quick support'
      ]
    }
  ]

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
              <Icon name="features" size={48} color="white" />
              Everything You Need to Collect Testimonials
            </h1>
            <p style={{
              fontSize: '20px',
              opacity: 0.9,
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              Simple, powerful features designed to make testimonial collection effortless. 
              Start building trust with your customers today.
            </p>
            <a
              href="/auth/signup"
              style={{
                background: 'white',
                color: '#667eea',
                padding: '16px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              <Icon name="rocket" size={18} color="#667eea" />
              Try It Free
            </a>
          </div>
        </section>

        {/* Features Grid */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '32px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <div style={{
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    padding: '16px',
                    borderRadius: '12px',
                    display: 'inline-flex'
                  }}>
                    <Icon name={feature.iconName} size={32} color="white" />
                  </div>
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  {feature.description}
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {feature.details.map((detail, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px',
                      color: '#374151'
                    }}>
                      <span style={{
                        marginRight: '12px',
                        display: 'flex'
                      }}>
                        <Icon name="success" size={16} color="#10b981" />
                      </span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: '80px 20px',
          background: '#1f2937',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <Icon name="rocket" size={32} color="white" />
              Ready to Start Collecting Testimonials?
            </h2>
            <p style={{
              fontSize: '18px',
              opacity: 0.9,
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              Join hundreds of businesses already using TestimonialPro to build trust and grow their sales.
            </p>
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <a
                href="/auth/signup"
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Icon name="rocket" size={18} color="white" />
                Start Free Trial
              </a>
              <a
                href="/contact"
                style={{
                  background: 'transparent',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  border: '2px solid rgba(255,255,255,0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Icon name="contact" size={18} color="white" />
                Contact Sales
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}