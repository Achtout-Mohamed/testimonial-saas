import { Icon, EmailIcon, WhatsAppIcon } from '@/components/Icon'

export default function Footer() {
  return (
    <footer style={{
      background: '#1f2937',
      color: 'white',
      padding: '60px 20px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          
          {/* Company Info */}
          <div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Icon name="logo" size={24} color="#3b82f6" />
              TestimonialPro
            </h3>
            <p style={{
              color: '#d1d5db',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              The easiest way to collect and display customer testimonials. 
              Start free with 10 testimonials included.
            </p>
            <div style={{
              display: 'flex',
              gap: '16px'
            }}>
              <a href="mailto:achtoutmohamed08@gmail.com" style={{
                color: '#9ca3af',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <EmailIcon size={16} />
                Email
              </a>
              <a href="https://wa.me/212611110589" style={{
                color: '#9ca3af',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <WhatsAppIcon size={16} />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#f9fafb',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Icon name="link" size={18} color="#f9fafb" />
              Quick Links
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <a href="/features" style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Icon name="features" size={14} />
                Features
              </a>
              <a href="/pricing" style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Icon name="pricing" size={14} />
                Pricing
              </a>
              <a href="/about" style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Icon name="about" size={14} />
                About
              </a>
              <a href="/contact" style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Icon name="contact" size={14} />
                Contact
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#f9fafb',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Icon name="support" size={18} color="#f9fafb" />
              Support
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <a href="/contact" style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Icon name="help" size={14} />
                Get Help
              </a>
              <a href="mailto:achtoutmohamed08@gmail.com" style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Icon name="email" size={14} />
                Email Support
              </a>
              <span style={{
                color: '#9ca3af',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Icon name="clock" size={12} />
                Response time: 24 hours
              </span>
            </div>
          </div>

          {/* Getting Started */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#f9fafb',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Icon name="rocket" size={18} color="#f9fafb" />
              Get Started
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <a href="/auth/signup" style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Icon name="signup" size={14} />
                Sign Up Free
              </a>
              <a href="/auth/login" style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Icon name="login" size={14} />
                Sign In
              </a>
              <span style={{
                color: '#9ca3af',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Icon name="free" size={12} />
                No credit card required
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Icon name="shield" size={14} />
            © 2024 TestimonialPro. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            gap: '20px'
          }}>
            <a href="/privacy" style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Icon name="lock" size={12} />
              Privacy Policy
            </a>
            <a href="/terms" style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Icon name="file" size={12} />
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}