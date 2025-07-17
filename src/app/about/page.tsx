'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ProfileImage from '@/components/ProfileImage'

export default function AboutPage() {
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
              About TestimonialPro
            </h1>
            <p style={{
              fontSize: '20px',
              opacity: 0.9,
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              We help small businesses and agencies collect and display customer testimonials effortlessly.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'white',
            padding: '48px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            marginBottom: '48px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              Why We Built This
            </h2>
            
            <div style={{
              fontSize: '18px',
              color: '#374151',
              lineHeight: '1.8',
              marginBottom: '32px'
            }}>
              <p style={{ marginBottom: '24px' }}>
                As a business owner, I was frustrated with how difficult it was to collect testimonials. 
                Customers would promise to write reviews but never follow through. When they did, 
                the testimonials were scattered across emails and hard to use on my website.
              </p>
              
              <p style={{ marginBottom: '24px' }}>
                I tried existing tools, but they were either too complicated, too expensive, or didn&apos;t 
                work well for small businesses. I needed something simple that just worked.
              </p>
              
              <p style={{ marginBottom: '24px' }}>
                So I built TestimonialPro - a tool that makes collecting testimonials as easy as 
                sending a link. No complicated setup, no monthly fees for basic features, 
                and no technical skills required.
              </p>
            </div>

            <div style={{
              background: '#f0f9ff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #bfdbfe',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '16px',
                color: '#1e40af',
                fontStyle: 'italic',
                margin: 0
              }}>
                &quot;TestimonialPro has helped over 500+ businesses collect more than 10,000 testimonials. 
                We&apos;re just getting started!&quot;
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            color: '#1f2937',
            marginBottom: '48px'
          }}>
            Our Values
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {[
              {
                icon: '🎯',
                title: 'Simple & Focused',
                description: 'We believe software should be simple. No bloated features, just what you need to collect testimonials effectively.'
              },
              {
                icon: '💚',
                title: 'Small Business First',
                description: 'Built for entrepreneurs and small businesses who need results without complexity or huge budgets.'
              },
              {
                icon: '🚀',
                title: 'Fast & Reliable',
                description: 'Your testimonials are important. We ensure our platform is fast, reliable, and always available.'
              },
              {
                icon: '🤝',
                title: 'Personal Support',
                description: 'Real people, real help. We respond to every email personally and genuinely care about your success.'
              }
            ].map((value, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '32px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '20px'
                }}>
                  {value.icon}
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>
                  {value.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section with Your Photo */}
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
            Meet the Founder
          </h2>
          
          <div style={{
            background: 'white',
            padding: '48px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            {/* Your Profile Image */}
            <ProfileImage 
              src="/images/me.jpg"
              alt="Mohamed Achtout - Founder & Developer"
              size={150}
            />
            
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              Mohamed Achtout
            </h3>
            
            <p style={{
              color: '#3b82f6',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '24px'
            }}>
              Founder & Developer
            </p>
            
            <div style={{
              background: '#f0f9ff',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid #bfdbfe'
            }}>
              <p style={{
                color: '#374151',
                lineHeight: '1.8',
                fontSize: '16px',
                margin: 0
              }}>
                Hey! I&apos;m Mohamed, a passionate developer from Morocco who loves building tools that help small 
                businesses succeed. With expertise in modern web technologies and a deep understanding of 
                business needs, I created TestimonialPro to solve the real problem of collecting authentic 
                customer feedback. When I&apos;m not coding, you&apos;ll find me helping other entrepreneurs 
                or exploring new technologies that can make business operations simpler and more effective.
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <a 
                href="mailto:achtoutmohamed08@gmail.com"
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📧 Email Me
              </a>
              <a 
                href="https://wa.me/212611110589"
                style={{
                  background: '#25d366',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📱 WhatsApp
              </a>
              <a 
                href="https://github.com/Achtout-Mohamed"
                style={{
                  background: '#1f2937',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                💻 GitHub
              </a>
            </div>
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
              marginBottom: '24px'
            }}>
              Ready to Start Your Journey?
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
                  display: 'inline-block'
                }}
              >
                🚀 Start Free Today
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
                  display: 'inline-block'
                }}
              >
                💬 Get in Touch
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}