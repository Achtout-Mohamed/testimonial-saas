'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [isVerifying, setIsVerifying] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include' // Important for cookies
        })

        if (response.ok) {
          setIsAdmin(true)
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Error verifying admin access:', error)
        router.push('/admin/login')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyAdminAccess()
  }, [router])

  if (isVerifying) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}