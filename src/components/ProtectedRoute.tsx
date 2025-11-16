'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't protect the login page itself
    if (pathname === '/admin/login') {
      setIsAuthenticated(true)
      return
    }
    
    // Check if user is authenticated via localStorage
    const token = localStorage.getItem('admin-auth-token')
    if (!token) {
      // Redirect to login page if not authenticated
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router, pathname])

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return null
  }

  // Render children if authenticated or on login page
  return <>{children}</>
}