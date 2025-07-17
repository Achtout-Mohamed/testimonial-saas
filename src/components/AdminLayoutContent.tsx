'use client'
import { useRouter } from 'next/navigation'

interface AdminLayoutContentProps {
  children: React.ReactNode
}

export default function AdminLayoutContent({ children }: AdminLayoutContentProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if logout fails
      router.push('/admin/login')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Admin Navigation */}
      <nav style={{
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '0 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '60px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937'
            }}>
              🛠️ Admin Panel
            </div>
            
            <div style={{
              display: 'flex',
              gap: '24px'
            }}>
              <a href="/admin/contacts" style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}>
                📧 Contact Messages
              </a>
              <a href="/dashboard" style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}>
                📊 Dashboard
              </a>
              <a href="/admin/analytics" style={{
  color: '#6b7280',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'color 0.2s'
}}>
  📊 Analytics
</a>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              fontSize: '12px',
              color: '#10b981',
              fontWeight: '500',
              background: '#d1fae5',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              ADMIN
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </div>
  )
}