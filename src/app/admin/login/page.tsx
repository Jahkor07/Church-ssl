'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Connect to Next.js backend on port 3000
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        // Store auth token
        localStorage.setItem('admin-auth-token', data.token)
        // Redirect to dashboard
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Invalid username or password')
        setIsLoading(false)
      }
    } catch (error) {
      setError('Network error. Please try again.')
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Background Image - FULL PAGE COVERAGE */}
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        @media (max-width: 640px) {
          .responsive-container {
            padding: 1rem;
          }
          
          .responsive-text-large {
            font-size: 1.5rem;
          }
          
          .responsive-text-medium {
            font-size: 1rem;
          }
          
          .responsive-input {
            padding: 0.75rem;
          }
          
          .responsive-logo {
            width: 5rem;
            height: 5rem;
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          .responsive-container {
            padding: 1.5rem;
          }
          
          .responsive-text-large {
            font-size: 2rem;
          }
          
          .responsive-text-medium {
            font-size: 1.125rem;
          }
          
          .responsive-input {
            padding: 1rem;
          }
          
          .responsive-logo {
            width: 6rem;
            height: 6rem;
          }
        }
        
        @media (min-width: 1025px) {
          .responsive-container {
            padding: 2rem;
          }
          
          .responsive-text-large {
            font-size: 2.25rem;
          }
          
          .responsive-text-medium {
            font-size: 1.25rem;
          }
          
          .responsive-input {
            padding: 1.125rem;
          }
          
          .responsive-logo {
            width: 6rem;
            height: 6rem;
          }
        }
        
        /* Optimize transitions for performance */
        .optimized-transition {
          transition: all 0.2s ease-out;
          will-change: transform;
        }
        
        .optimized-transition-fast {
          transition: all 0.15s ease-out;
          will-change: transform;
        }
        
        /* Optimize backdrop blur */
        .optimized-backdrop {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        /* Master fade and blend effect for logo */
        .master-blend-logo {
          opacity: 0.8;
          filter: blur(0.5px) brightness(1.1);
          mix-blend-mode: soft-light;
          border-radius: 22px;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }
      `}</style>
      
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url('/images/backgrounds/S3.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          zIndex: -2
        }}
      ></div>
      
      {/* Solid color fallback */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#4f46e5',
          zIndex: -3
        }}
      ></div>
      
      {/* Background Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3), rgba(79, 70, 229, 0.3))',
          zIndex: -1
        }}
      ></div>
      
      {/* Content Container with responsive padding */}
      <div className="relative z-10 flex items-center justify-center w-full h-full responsive-container">
        <div className="w-full max-w-md space-y-4 bg-white/10 dark:bg-gray-900/10 optimized-backdrop rounded-2xl border border-white/20 dark:border-gray-700/20 p-5 sm:p-6 shadow-2xl">
          {/* Header with responsive text */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <div className="mx-auto mb-3 sm:mb-4 overflow-hidden shadow-lg responsive-logo">
                <Image
                  src="/S.png"
                  alt="Church SSL Logo"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain master-blend-logo"
                />
              </div>
            </Link>
            <h2 className="font-bold text-white mb-1 responsive-text-large">
              Welcome Back
            </h2>
            <p className="text-white/80 responsive-text-medium">
              Sign in to your admin account
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-500/20 border border-red-400/30 p-3 optimized-backdrop">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <h3 className="text-sm sm:text-base font-medium text-red-100">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm sm:text-base font-medium text-white mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full responsive-input bg-white/20 border border-white/30 rounded-lg sm:rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white optimized-backdrop optimized-transition-fast"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm sm:text-base font-medium text-white mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full responsive-input bg-white/20 border border-white/30 rounded-lg sm:rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white optimized-backdrop optimized-transition-fast"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 focus:ring-blue-400 border-white/30 rounded bg-white/20 optimized-transition"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-white optimized-transition">
                  Remember me
                </label>
              </div>

              <div className="text-xs sm:text-sm">
                <a href="#" className="font-medium text-blue-200 hover:text-blue-100 optimized-transition">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg sm:rounded-xl shadow-lg text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 optimized-transition"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="p-3 bg-blue-500/20 rounded-lg sm:rounded-xl border border-blue-400/30 optimized-backdrop">
            <h3 className="text-sm sm:text-base font-medium text-blue-100 mb-1">
              Demo Credentials
            </h3>
            <p className="text-xs sm:text-sm text-blue-50">
              Username: <code className="bg-blue-400/30 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-white">admin</code><br/>
              Password: <code className="bg-blue-400/30 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-white">password</code>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center pt-2">
            <Link 
              href="/" 
              className="text-sm sm:text-base text-blue-200 hover:text-blue-100 optimized-transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}