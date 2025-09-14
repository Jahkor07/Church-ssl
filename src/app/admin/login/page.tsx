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
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Mock login - simulate API call
    setTimeout(() => {
      console.log('Login attempt:', formData)
      setIsLoading(false)
      router.push('/admin/dashboard')
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/backgrounds/S3.jpg')`
        }}
      ></div>
      
       {/* Background Overlay */}
       <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-indigo-800/30"></div>
      
      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="w-20 h-20 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center mb-6 overflow-hidden shadow-xl">
              <Image
                src="/S.png"
                alt="Church SSL Logo"
                width={60}
                height={60}
                className="w-12 h-12 object-contain"
              />
            </div>
          </Link>
           <h2 className="text-3xl font-bold text-white">
             Welcome Back
           </h2>
           <p className="mt-2 text-sm text-white/90">
             Sign in to your admin account
           </p>
        </div>

         {/* Login Form */}
         <div className="bg-white/20 dark:bg-gray-800/20 py-8 px-8 shadow-2xl rounded-2xl border border-white/30 dark:border-gray-700/30 backdrop-blur-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-white/30 rounded-xl placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm bg-white/20 backdrop-blur-sm text-white transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-white/30 rounded-xl placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm bg-white/20 backdrop-blur-sm text-white transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 rounded bg-white/20"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-300 hover:text-blue-200">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
           <div className="mt-6 p-4 bg-blue-500/20 rounded-xl border border-blue-400/30 backdrop-blur-sm">
             <h3 className="text-sm font-medium text-blue-200 mb-2">
               Demo Credentials
             </h3>
             <p className="text-xs text-blue-100">
               Username: <code className="bg-blue-400/30 px-2 py-1 rounded text-white">admin</code><br/>
               Password: <code className="bg-blue-400/30 px-2 py-1 rounded text-white">password</code>
             </p>
           </div>
        </div>

         {/* Back to Home */}
         <div className="text-center">
           <Link 
             href="/" 
             className="text-sm text-blue-300 hover:text-blue-200"
           >
             ← Back to Home
           </Link>
         </div>
      </div>
    </div>
  )
}
