import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/backgrounds/S2.jpg')`
        }}
      ></div>
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-purple-600/40 to-indigo-800/40"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Church Logo */}
        <div className="mb-12">
          <div className="w-32 h-32 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm overflow-hidden shadow-2xl border border-white/20">
            <Image
              src="/S.png"
              alt="Church SSL Logo"
              width={100}
              height={100}
              className="w-24 h-24 object-contain drop-shadow-lg"
              priority
            />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            Church SSL
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            Study, Share, and Grow in Faith
          </p>
        </div>

        {/* CTA Button */}
        <div className="space-y-8">
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-white/90 text-xl px-12 py-6 h-auto font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-full"
          >
            <Link href="/admin/login">
              Get Started
              <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </Button>
          
          <p className="text-white/80 text-base max-w-md mx-auto leading-relaxed">
            Access the lesson management system and administrative tools
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-white/90">
          <div className="space-y-4 group">
            <div className="w-16 h-16 mx-auto bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl group-hover:bg-white/25 transition-all duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors">Study</h3>
            <p className="text-base leading-relaxed">Deep dive into scripture with structured lessons and guided study materials</p>
          </div>
          
          <div className="space-y-4 group">
            <div className="w-16 h-16 mx-auto bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl group-hover:bg-white/25 transition-all duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors">Share</h3>
            <p className="text-base leading-relaxed">Connect with your community and share insights through collaborative learning</p>
          </div>
          
          <div className="space-y-4 group">
            <div className="w-16 h-16 mx-auto bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl group-hover:bg-white/25 transition-all duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors">Grow</h3>
            <p className="text-base leading-relaxed">Strengthen your faith through guided study and spiritual development</p>
          </div>
        </div>
      </div>
    </div>
  )
}