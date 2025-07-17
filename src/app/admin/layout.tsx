'use client'
import { usePathname } from 'next/navigation'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import AdminLayoutContent from '@/components/AdminLayoutContent'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't apply protection to login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <AdminProtectedRoute>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </AdminProtectedRoute>
  )
}