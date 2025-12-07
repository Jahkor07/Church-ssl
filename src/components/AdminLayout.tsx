'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import GlobalWrapper from '@/components/GlobalWrapper'
import { 
  LayoutDashboard, 
  BookOpen, 
  Upload, 
  Settings, 
  Menu, 
  X,
  LogOut,
  User,
  Moon,
  Sun
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Lessons', href: '/admin/lessons', icon: BookOpen },
  { name: 'Upload Lesson', href: '/admin/lessons/upload', icon: Upload },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login'

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Handle logout
  const handleLogout = () => {
    // Remove auth token and redirect to home page
    localStorage.removeItem('admin-auth-token')
    router.push('/')
  }

  return (
    <ProtectedRoute>
      {/* Full screen container with flex centering similar to homepage */}
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
        {/* Background Image - using same classes as homepage */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/backgrounds/S3.jpg')`
          }}
        ></div>
        
        {/* Background Overlay - using same approach as homepage */}
        <div className="absolute inset-0 bg-gray-50/95 dark:bg-gray-900/95"></div>
        
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - only render if not on login page */}
        {!isLoginPage && (
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
                <Link href="/admin/dashboard" className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                    <Image
                      src="/S.png"
                      alt="Church SSL Logo"
                      width={40}
                      height={40}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Church SSL</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              {/* User info and logout */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        Admin User
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        admin@churchssl.com
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main content - using flex to center content similar to homepage */}
        <div className={`relative z-10 ${!isLoginPage ? 'lg:pl-64' : ''} min-h-screen w-full flex items-center justify-center`}>
          {/* Header - only show if not on login page */}
          {!isLoginPage && (
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 absolute top-0 left-0 right-0">
              <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                
                  <div className="ml-4 lg:ml-0">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {navigation.find(item => item.href === pathname)?.name || 'Admin Dashboard'}
                    </h1>
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Main content area - ensure it fills the screen and centers content */}
          <main className="flex-1 w-full flex items-center justify-center">
            <div className="py-6 w-full h-full flex items-center justify-center">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full h-full flex items-center justify-center">
                {/* Wrap main content with fallback image */}
                <div className="main-content w-full h-full flex items-center justify-center">
                  {/* Show placeholder image only on the base admin path */}
                  {pathname === '/admin' || pathname === '/admin/' ? (
                    <div className="empty-state w-full h-full flex items-center justify-center">
                      <img 
                        src="/images/placeholder.png" 
                        alt="Select an option from the sidebar" 
                        className="placeholder-image"
                      />
                    </div>
                  ) : (
                    // Apply global wrapper to all non-login pages
                    isLoginPage ? children : <GlobalWrapper>{children}</GlobalWrapper>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}