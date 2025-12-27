'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    try {
      // 1. Authenticate with the external backend
      const authResponse = await fetch('https://church-ssl-backend.onrender.com/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!authResponse.ok) {
        const errorData = await authResponse.json()
        setError(errorData.message || 'Login failed. Please check your credentials.')
        return
      }

      const authData = await authResponse.json()
      const token = authData.jwt

      if (!token) {
        setError('Login failed: No JWT token received.')
        return
      }

      // 2. Use a local API route to set the cookie
      const cookieResponse = await fetch('/api/auth/set-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!cookieResponse.ok) {
        throw new Error('Failed to set authentication cookie.');
      }

      // 3. Redirect to the dashboard
      window.location.href = '/admin/dashboard'

    } catch (err) {
      setError('An error occurred during login. Please try again.')
      console.error(err)
    }
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
.
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

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full px-3 py-2 text-white bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 responsive-input"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-3 py-2 text-white bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 responsive-input"
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg sm:rounded-xl shadow-lg text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 optimized-transition">
              Sign In
            </Button>
          </form>

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