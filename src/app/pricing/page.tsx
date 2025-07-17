import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for trying out our platform',
      features: [
        'Up to 10 testimonials',
        '1 website widget',
        'Basic dashboard',
        'Email support',
        'Standard templates'
      ],
      popular: false,
      cta: 'Get Started Free',
      href: '/auth/signup'
    },
    {
      name: 'Professional',
      price: 29,
      period: 'month',
      description: 'Best for growing businesses',
      features: [
        'Unlimited testimonials',
        'Unlimited widgets',
        'Advanced dashboard',
        'Priority support',
        'Custom branding',
        'Analytics & insights',
        'Export testimonials',
        'API access'
      ],
      popular: true,
      cta: 'Contact Us',
      href: '/contact'
    },
    {
      name: 'Enterprise',
      price: 99,
      period: 'month',
      description: 'For large teams and agencies',
      features: [
        'Everything in Professional',
        'White-label solution',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'Multi-team management',
        'Advanced security',
        'Custom development'
      ],
      popular: false,
      cta: 'Contact Sales',
      href: '/contact'
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
              lineHeight: '1.2'
            }}>
              💰 Simple, Transparent Pricing
            </h1>
            <p style={{
              fontSize: '20px',
              opacity: 0.9,
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              Choose the perfect plan for your testimonial collection needs. 
              Start free, upgrade when you're ready.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'stretch'
          }}>
            {plans.map((plan, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '40px 32px',
                  borderRadius: '16px',
                  boxShadow: plan.popular ? '0 20px 40px rgba(59, 130, 246, 0.1)' : '0 10px 30px rgba(0,0,0,0.1)',
                  border: plan.popular ? '3px solid #3b82f6' : '1px solid #e5e7eb',
                  position: 'relative',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.2s'
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#3b82f6',
                    color: 'white',
                    padding: '8px 24px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    🔥 Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    {plan.name}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    marginBottom: '24px'
                  }}>
                    {plan.description}
                  </p>
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{
                      fontSize: '48px',
                      fontWeight: '700',
                      color: '#1f2937'
                    }}>
                      ${plan.price}
                    </span>
                    <span style={{
                      fontSize: '16px',
                      color: '#6b7280',
                      marginLeft: '8px'
                    }}>
                      /{plan.period}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 32px 0',
                  minHeight: '240px'
                }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px',
                      color: '#374151'
                    }}>
                      <span style={{
                        color: '#10b981',
                        marginRight: '12px',
                        fontSize: '16px'
                      }}>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div style={{ textAlign: 'center' }}>
                  <a
                    href={plan.href}
                    style={{
                      background: plan.popular ? '#3b82f6' : '#6b7280',
                      color: 'white',
                      padding: '16px 24px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'inline-block',
                      width: '100%',
                      transition: 'background 0.2s'
                    }}
                  >
                    {plan.cta}
                  </a>
                  {plan.name !== 'Free' && (
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginTop: '8px'
                    }}>
                      Contact us for custom pricing
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            color: '#1f2937',
            marginBottom: '48px'
          }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{
            display: 'grid',
            gap: '24px'
          }}>
            {[
              {
                q: 'Can I change plans anytime?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.'
              },
              {
                q: 'What happens to my data if I cancel?',
                a: 'Your data is safe! You\'ll have 30 days to export your testimonials before your account is permanently deleted.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your payment.'
              },
              {
                q: 'How does the free plan work?',
                a: 'The free plan includes 10 testimonials and 1 widget forever. No credit card required, no time limit.'
              },
              {
                q: 'Can I get help setting up?',
                a: 'Absolutely! We provide email support for all plans and priority support for paid plans. Setup takes just 5 minutes.'
              }
            ].map((faq, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  {faq.q}
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}