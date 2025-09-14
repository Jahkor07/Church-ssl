'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Filter, ChevronDown, ChevronRight, BookOpen, Calendar, Globe } from 'lucide-react'

// Mock data for lessons
const mockLessons = {
  'Q1 2024': {
    'Week 1': [
      { id: '1', title: 'The Beginning of the Gospel', description: 'Understanding the foundation of our faith', date: '2024-01-06' },
      { id: '2', title: 'The Call to Discipleship', description: 'Following Jesus in daily life', date: '2024-01-07' },
      { id: '3', title: 'The Kingdom of God', description: 'Living in God\'s kingdom today', date: '2024-01-08' },
    ],
    'Week 2': [
      { id: '4', title: 'The Power of Prayer', description: 'Connecting with God through prayer', date: '2024-01-13' },
      { id: '5', title: 'Faith and Works', description: 'The relationship between belief and action', date: '2024-01-14' },
    ],
    'Week 3': [
      { id: '6', title: 'The Holy Spirit', description: 'Understanding the third person of the Trinity', date: '2024-01-20' },
      { id: '7', title: 'Spiritual Gifts', description: 'Discovering and using your spiritual gifts', date: '2024-01-21' },
    ],
  },
  'Q2 2024': {
    'Week 1': [
      { id: '8', title: 'The Resurrection', description: 'The foundation of Christian hope', date: '2024-04-06' },
      { id: '9', title: 'New Life in Christ', description: 'Living as a new creation', date: '2024-04-07' },
    ],
  },
}

export default function LessonsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [selectedYear, setSelectedYear] = useState('2024')
  const [expandedQuarters, setExpandedQuarters] = useState<string[]>(['Q1 2024'])
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>(['Week 1'])

  const toggleQuarter = (quarter: string) => {
    setExpandedQuarters(prev => 
      prev.includes(quarter) 
        ? prev.filter(q => q !== quarter)
        : [...prev, quarter]
    )
  }

  const toggleWeek = (week: string) => {
    setExpandedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week]
    )
  }

  const filteredLessons = Object.entries(mockLessons).reduce((acc, [quarter, weeks]) => {
    const filteredWeeks = Object.entries(weeks).reduce((weekAcc, [week, lessons]) => {
      const filteredLessons = lessons.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      if (filteredLessons.length > 0) {
        (weekAcc as any)[week] = filteredLessons
      }
      return weekAcc
    }, {} as any)
    
    if (Object.keys(filteredWeeks).length > 0) {
      (acc as any)[quarter] = filteredWeeks
    }
    return acc
  }, {} as any)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lessons</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Explore our comprehensive collection of spiritual lessons and studies
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Language Filter */}
          <div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>Portuguese</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="space-y-6">
        {Object.entries(filteredLessons).map(([quarter, weeks]) => (
          <div key={quarter} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Quarter Header */}
            <button
              onClick={() => toggleQuarter(quarter)}
              className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{quarter}</h2>
                {expandedQuarters.includes(quarter) ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* Weeks */}
            {expandedQuarters.includes(quarter) && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                {Object.entries(weeks as any).map(([week, lessons]: [string, any]) => (
                  <div key={week} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    {/* Week Header */}
                    <button
                      onClick={() => toggleWeek(week)}
                      className="w-full px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{week}</h3>
                        {expandedWeeks.includes(week) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Lessons */}
                    {expandedWeeks.includes(week) && (
                      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {lessons.map((lesson: any) => (
                            <div
                              key={lesson.id}
                              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <BookOpen className="w-5 h-5 text-blue-600 mt-1" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(lesson.date).toLocaleDateString()}
                                </span>
                              </div>
                              
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {lesson.title}
                              </h4>
                              
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                {lesson.description}
                              </p>
                              
                              <Button asChild size="sm" className="w-full">
                                <Link href={`/lessons/${lesson.id}`}>
                                  View Lesson
                                </Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {Object.keys(filteredLessons).length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No lessons found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

