'use client'

import React from 'react'

interface BarChartProps {
  data: { date: string; count: number }[]
  title: string
}

export default function BarChart({ data, title }: BarChartProps) {
  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map(item => item.count), 1)
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="flex items-end justify-between h-48">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 px-1">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {item.count}
            </div>
            <div
              className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
              style={{
                height: `${(item.count / maxValue) * 100}%`,
                minHeight: '2px'
              }}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {item.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}