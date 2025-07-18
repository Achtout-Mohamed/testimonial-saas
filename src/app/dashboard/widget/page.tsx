'use client'
import { useState, useEffect } from 'react'
import { createSupabaseComponentClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import ProtectedRoute from '@/components/ProtectedRoute'
import { trackEvent } from '@/lib/analytics'
import { useRouter } from 'next/navigation' 

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
  const [widgetStats, setWidgetStats] = useState({
    generated: false,
    copied: false
  })
  const supabase = createSupabaseComponentClient()
  const router = useRouter() // ADD THIS LINE

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

  const loadApprovedTestimonials = async (userIdParam: string) => {
    try {
      const response = await fetch(`/api/testimonials/widget?userId=${userIdParam}&limit=${settings.maxTestimonials}`)
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

  // Track when widget is generated (settings change)
  useEffect(() => {
    if (user && !widgetStats.generated) {
      setWidgetStats(prev => ({ ...prev, generated: true }))
      trackEvent.widgetGenerated(settings.theme, testimonials.length)
    }
  }, [settings, user, testimonials.length, widgetStats.generated])

  const generateWidgetCode = () => {
    if (!user) return ''
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const widgetId = `widget-${user.id}-${Date.now()}`
    
    return `<!-- TestimonialPro Widget with Analytics -->
<div id="testimonial-widget-${user.id}"></div>
<script>
(function() {
  const widgetId = 'testimonial-widget-${user.id}';
  const userId = '${user.id}';
  const apiUrl = '${baseUrl}/api/testimonials/widget?userId=${user.id}&limit=${settings.maxTestimonials}';
  const analyticsUrl = '${baseUrl}/api/analytics/widgets';
  const widgetInstanceId = '${widgetId}';
  
  // Generate session ID for this widget instance
  function generateSessionId() {
    return 'widget_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  const sessionId = generateSessionId();
  
  // Analytics tracking function
  function trackWidgetEvent(eventType, properties = {}) {
    fetch(analyticsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        widgetId: widgetInstanceId,
        eventType: eventType,
        websiteDomain: window.location.hostname,
        referrer: document.referrer,
        sessionId: sessionId,
        properties: {
          ...properties,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          theme: '${settings.theme}',
          maxTestimonials: ${settings.maxTestimonials},
          showEmail: ${settings.showEmail}
        }
      })
    }).catch(err => console.debug('Widget analytics:', err));
  }
  
  // Track widget load
  trackWidgetEvent('widget_load');
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(testimonials => {
      const widget = document.getElementById(widgetId);
      if (!widget) return;
      
      if (testimonials.length === 0) {
        widget.innerHTML = \`
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; text-align: center; color: #6b7280;">
            <p>No testimonials available yet.</p>
          </div>
        \`;
        return;
      }
      
      // Track widget view (when testimonials are displayed)
      trackWidgetEvent('widget_view', { 
        testimonialCount: testimonials.length,
        averageRating: (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      });
      
      const widgetHTML = \`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
         <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px; gap: 8px;">
           <h3 style="color: ${settings.theme === 'dark' ? '#f9fafb' : '#1f2937'}; margin: 0; font-size: 20px; font-weight: 600;">
             What Our Customers Say
           </h3>
           <div style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">
             \${testimonials.length} review\${testimonials.length !== 1 ? 's' : ''}
           </div>
         </div>
         <div style="display: grid; gap: 16px;">
           \${testimonials.map((t, index) => \`
             <div 
               class="testimonial-card" 
               data-testimonial-id="\${t.id}"
               style="
                 background: ${settings.theme === 'dark' ? '#1f2937' : '#ffffff'}; 
                 padding: 20px; 
                 border-radius: 12px; 
                 box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
                 border: 1px solid ${settings.theme === 'dark' ? '#374151' : '#e5e7eb'};
                 transition: all 0.2s ease;
                 cursor: pointer;
                 position: relative;
                 overflow: hidden;
               "
               onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)';"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)';"
               onclick="handleTestimonialClick('\${t.id}', \${index})"
             >
               <div style="display: flex; align-items: center; margin-bottom: 12px; justify-content: space-between;">
                 <div style="display: flex; align-items: center; gap: 8px;">
                   <div style="color: #fbbf24; font-size: 16px;">\${'⭐'.repeat(t.rating)}</div>
                   <span style="font-weight: 600; color: ${settings.theme === 'dark' ? '#f9fafb' : '#1f2937'};">\${t.customer_name}</span>
                   ${settings.showEmail ? `<span style="color: #6b7280; font-size: 14px;">(\${t.customer_email})</span>` : ''}
                 </div>
                 <div style="background: #f0f9ff; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 500;">
                   VERIFIED
                 </div>
               </div>
               <p style="
                 color: ${settings.theme === 'dark' ? '#d1d5db' : '#374151'}; 
                 line-height: 1.6; 
                 margin: 0 0 12px 0;
                 font-style: italic;
               ">
                 "\${t.message}"
               </p>
               <div style="display: flex; justify-content: space-between; align-items: center;">
                 <div style="font-size: 12px; color: #9ca3af;">
                   \${new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                 </div>
                 <div style="font-size: 11px; color: #10b981; font-weight: 500;">
                   ✓ Verified Review
                 </div>
               </div>
             </div>
           \`).join('')}
         </div>
         
         <!-- Widget Footer -->
         <div style="
           text-align: center; 
           margin-top: 20px; 
           padding: 12px; 
           background: ${settings.theme === 'dark' ? '#374151' : '#f8fafc'}; 
           border-radius: 8px;
           border: 1px solid ${settings.theme === 'dark' ? '#4b5563' : '#e5e7eb'};
         ">
           <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
             Powered by TestimonialPro
           </div>
           <div style="font-size: 11px; color: #9ca3af;">
             Authentic customer feedback
           </div>
         </div>
       </div>
     \`;
     
     widget.innerHTML = widgetHTML;
     
     // Add click tracking to testimonials
     window.handleTestimonialClick = function(testimonialId, index) {
       trackWidgetEvent('testimonial_click', { 
         testimonialId: testimonialId,
         position: index + 1,
         totalTestimonials: testimonials.length
       });
       
       // Optional: Add custom behavior here (e.g., open modal, redirect, etc.)
       console.log('Testimonial clicked:', testimonialId);
     };
     
     // Track widget visibility when it comes into view
     const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           trackWidgetEvent('widget_visible', {
             visibilityRatio: entry.intersectionRatio
           });
           observer.unobserve(entry.target);
         }
       });
     }, { threshold: 0.5 });
     
     observer.observe(widget);
     
   })
   .catch(error => {
     console.error('Error loading testimonials:', error);
     const widget = document.getElementById(widgetId);
     if (widget) {
       widget.innerHTML = \`
         <div style="
           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
           padding: 20px; 
           text-align: center; 
           color: #ef4444;
           background: #fef2f2;
           border: 1px solid #fca5a5;
           border-radius: 8px;
         ">
           <p style="margin: 0;">Unable to load testimonials at this time.</p>
         </div>
       \`;
     }
     
     trackWidgetEvent('widget_error', { 
       error: error.message || 'Unknown error'
     });
   });
})();
</script>

<!-- Optional: Add some CSS for better animations -->
<style>
 .testimonial-card {
   transition: all 0.2s ease !important;
 }
 
 .testimonial-card:hover {
   transform: translateY(-2px) !important;
   box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
 }
 
 @keyframes fadeIn {
   from { opacity: 0; transform: translateY(10px); }
   to { opacity: 1; transform: translateY(0); }
 }
 
 #testimonial-widget-${user.id} > div {
   animation: fadeIn 0.5s ease-out;
 }
</style>`
 }

 const copyToClipboard = (text: string) => {
   navigator.clipboard.writeText(text).then(() => {
     // Track widget code copy in Vercel Analytics
     trackEvent.widgetCodeCopied()
     
     // Track in internal analytics
     if (user) {
       fetch('/api/analytics/events', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           userId: user.id,
           eventType: 'widget_action',
           eventName: 'widget_code_copied',
           properties: { 
             theme: settings.theme,
             maxTestimonials: settings.maxTestimonials,
             showEmail: settings.showEmail
           }
         })
       })
     }
     
     setWidgetStats(prev => ({ ...prev, copied: true }))
     alert('Widget code copied to clipboard!')
   })
 }

 const goToDashboard = () => {
   router.push('/dashboard')
 }

 const handleSignOut = async () => {
   await supabase.auth.signOut()
   window.location.href = '/auth/login'
 }

 const handleSettingsChange = (key: string, value: any) => {
   setSettings(prev => ({ ...prev, [key]: value }))
   
   // Track settings changes
   if (user) {
     trackEvent.widgetGenerated(key === 'theme' ? value : settings.theme, testimonials.length)
   }
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
           color: '#374151',
           wordBreak: 'break-all'
         }}>
           {user ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/collect/${user.id}` : 'Loading...'}
         </div>
         <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
           <button
             onClick={() => {
               const link = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/collect/${user?.id}`
               navigator.clipboard.writeText(link)
               alert('Collection link copied!')
             }}
             style={{
               background: '#10b981',
               color: 'white',
               border: 'none',
               padding: '6px 12px',
               borderRadius: '4px',
               fontSize: '12px',
               fontWeight: '500',
               cursor: 'pointer'
             }}
           >
             📋 Copy Link
           </button>
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
                 onChange={(e) => handleSettingsChange('maxTestimonials', parseInt(e.target.value))}
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
                 onChange={(e) => handleSettingsChange('theme', e.target.value)}
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
                   onChange={(e) => handleSettingsChange('showEmail', e.target.checked)}
                   style={{ marginRight: '8px' }}
                 />
                 <span style={{ fontWeight: '500', color: '#374151' }}>Show customer email addresses</span>
               </label>
             </div>

             {/* Widget Stats */}
             <div style={{
               background: '#f0f9ff',
               padding: '16px',
               borderRadius: '8px',
               border: '1px solid #bfdbfe'
             }}>
               <h4 style={{
                 fontSize: '14px',
                 fontWeight: '600',
                 color: '#1e40af',
                 marginBottom: '8px'
               }}>
                 Widget Status
               </h4>
               <div style={{ fontSize: '12px', color: '#1e40af' }}>
                 ✅ Widget configured with {testimonials.length} testimonials
                 <br />
                 {widgetStats.copied ? '✅ Code copied to clipboard' : '📋 Ready to copy'}
                 <br />
                 🎨 Theme: {settings.theme} | 📊 Count: {settings.maxTestimonials}
               </div>
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
                 resize: 'none',
                 boxSizing: 'border-box'
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
                 <div style={{
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   marginBottom: '20px',
                   gap: '8px'
                 }}>
                   <h3 style={{ color: settings.theme === 'dark' ? '#f9fafb' : '#1f2937', margin: 0, fontSize: '20px', fontWeight: '600' }}>
                     What Our Customers Say
                   </h3>
                   <div style={{
                     background: '#10b981',
                     color: 'white',
                     padding: '4px 8px',
                     borderRadius: '4px',
                     fontSize: '12px',
                     fontWeight: '500'
                   }}>
                     {testimonials.length} review{testimonials.length !== 1 ? 's' : ''}
                   </div>
                 </div>
                 <div style={{ display: 'grid', gap: '16px' }}>
                   {testimonials.slice(0, settings.maxTestimonials).map((testimonial) => (
                     <div key={testimonial.id} style={{
                       background: settings.theme === 'dark' ? '#374151' : '#f8fafc',
                       padding: '20px',
                       borderRadius: '8px',
                       border: '1px solid ' + (settings.theme === 'dark' ? '#4b5563' : '#e5e7eb')
                     }}>
                       <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', justifyContent: 'space-between' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                         <div style={{
                           background: '#f0f9ff',
                           color: '#1e40af',
                           padding: '2px 6px',
                           borderRadius: '4px',
                           fontSize: '10px',
                           fontWeight: '500'
                         }}>
                           VERIFIED
                         </div>
                       </div>
                       <p style={{ 
                         color: settings.theme === 'dark' ? '#d1d5db' : '#374151', 
                         lineHeight: '1.6', 
                         margin: '0 0 12px 0',
                         fontStyle: 'italic'
                       }}>
                         "{testimonial.message}"
                       </p>
                       <div style={{
                         display: 'flex',
                         justifyContent: 'space-between',
                         alignItems: 'center'
                       }}>
                         <div style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af' }}>
                           {new Date(testimonial.created_at).toLocaleDateString()}
                         </div>
                         <div style={{
                           fontSize: '11px',
                           color: '#10b981',
                           fontWeight: '500'
                         }}>
                           ✓ Verified Review
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
                 
                 {/* Widget Footer Preview */}
                 <div style={{
                   textAlign: 'center',
                   marginTop: '20px',
                   padding: '12px',
                   background: settings.theme === 'dark' ? '#374151' : '#f8fafc',
                   borderRadius: '8px',
                   border: '1px solid ' + (settings.theme === 'dark' ? '#4b5563' : '#e5e7eb')
                 }}>
                   <div style={{
                     fontSize: '12px',
                     color: '#6b7280',
                     marginBottom: '4px'
                   }}>
                     Powered by TestimonialPro
                   </div>
                   <div style={{
                     fontSize: '11px',
                     color: '#9ca3af'
                   }}>
                     Authentic customer feedback
                   </div>
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