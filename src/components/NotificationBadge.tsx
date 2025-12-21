'use client'

import React from 'react'
import { Bell } from 'lucide-react'

interface NotificationBadgeProps {
  count: number
  onClick: () => void
}

export default function NotificationBadge({ count, onClick }: NotificationBadgeProps) {
  if (count === 0) return null

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
      >
        <Bell className="w-5 h-5" />
      </button>
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {count}
      </span>
    </div>
  )
}