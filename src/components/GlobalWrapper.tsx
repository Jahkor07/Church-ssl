'use client'

import React from 'react'

interface GlobalWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function GlobalWrapper({ 
  children, 
  className = '' 
}: GlobalWrapperProps) {
  return (
    <div 
      className={`w-full min-h-screen overflow-x-hidden ${className}`}
      style={{
        width: '100vw',
        minHeight: '100vh',
        overflowX: 'hidden'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full h-full">
        {children}
      </div>
    </div>
  )
}