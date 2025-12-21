'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Globe,
  BookOpen,
  AlertCircle,
  Database,
  CheckCircle,
  Clock,
  Bell,
  User,
  FileText,
  TrendingUp,
  Upload,
  Settings,
  BarChart3,
  FileSearch,
  HelpCircle,
  FileText as FileDocument
} from 'lucide-react'
import { searchLessons } from '@/lib/lessonActions'

interface Lesson {
  id: string
  title: string
  year: number
  language: {
    name: string
  }
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'info' | 'warning' | 'success'
}

interface RealNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

interface Activity {
  id: string
  action: string
  target: string
  time: string
  user: string
}

// Mock data for when API is not available
const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'The Beginning of the Gospel',
    year: 2024,
    language: { name: 'English' },
    isPublished: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    title: 'Faith and Works',
    year: 2024,
    language: { name: 'Spanish' },
    isPublished: false,
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z'
  }
]

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Lesson Published',
    description: 'Lesson "Understanding Grace" has been published successfully',
    time: '2 hours ago',
    read: false,
    type: 'success'
  },
  {
    id: '2',
    title: 'Draft Saved',
    description: 'Your lesson draft "Salvation" has been saved',
    time: '5 hours ago',
    read: true,
    type: 'info'
  },
  {
    id: '3',
    title: 'System Update',
    description: 'New features available in the dashboard',
    time: '1 day ago',
    read: false,
    type: 'info'
  }
]

const mockActivities: Activity[] = [
  {
    id: '1',
    action: 'Created',
    target: 'Lesson "Understanding Grace"',
    time: '2 hours ago',
    user: 'Admin'
  },
  {
    id: '2',
    action: 'Updated',
    target: 'Lesson "Salvation"',
    time: '5 hours ago',
    user: 'Admin'
  },
  {
    id: '3',
    action: 'Published',
    target: 'Lesson "Baptism Explained"',
    time: '1 day ago',
    user: 'Admin'
  }
]

export default function AdminDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiAvailable, setApiAvailable] = useState<boolean>(true)
  const router = useRouter()

  // Fetch recent lessons from API
  const fetchRecentLessons = useCallback(async () => {
    try {
      setLoading(true)
      const result = await searchLessons('', 1, 5) // Get only 5 most recent lessons
      
      // If we get a successful response, update state
      if (result && result.lessons) {
        setLessons(result.lessons)
        setApiAvailable(true)
        setError(null)
      } else {
        // Use mock data when API returns empty data
        setLessons(mockLessons)
        setApiAvailable(false)
        setError('Unable to connect to the database. Displaying sample data.')
      }
    } catch (err: any) {
      console.error('Error fetching recent lessons:', err)
      
      // Use mock data for any error
      setLessons(mockLessons)
      setApiAvailable(false)
      setError('Failed to load recent lessons. Displaying sample data.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch real notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const realNotifications: RealNotification[] = await response.json()
        
        // Transform real notifications to match the existing Notification interface
        const transformedNotifications: Notification[] = realNotifications.map(notification => ({
          id: notification.id,
          title: notification.title,
          description: notification.message,
          time: formatTimeAgo(new Date(notification.createdAt)),
          read: notification.read,
          type: notification.type === 'error' ? 'warning' : (notification.type as 'info' | 'warning' | 'success')
        }))
        
        // Only update notifications if we have real data
        if (transformedNotifications.length > 0) {
          setNotifications(transformedNotifications)
        }
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      // Silently fail - keep using mock notifications
    }
  }, [])

  useEffect(() => {
    fetchRecentLessons()
    fetchNotifications()
  }, [fetchRecentLessons, fetchNotifications])

  // Poll for notifications every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications()
    }, 15000) // 15 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const handleDelete = (lessonId: string) => {
    setLessonToDelete(lessonId)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (lessonToDelete) {
      console.log('Deleting lesson:', lessonToDelete)
      // In a real app, this would make an API call
      setShowDeleteModal(false)
      setLessonToDelete(null)
      // Refresh the lessons list
      fetchRecentLessons()
    }
  }

  const getStatusColor = (isPublished: boolean) => {
    return isPublished 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }

  const getStatusText = (isPublished: boolean) => {
    return isPublished ? 'Published' : 'Draft'
  }

  // Format time ago (e.g., "2 hours ago")
  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    let interval = Math.floor(seconds / 31536000)
    if (interval > 1) return `${interval} years ago`
    if (interval === 1) return '1 year ago'
    
    interval = Math.floor(seconds / 2592000)
    if (interval > 1) return `${interval} months ago`
    if (interval === 1) return '1 month ago'
    
    interval = Math.floor(seconds / 86400)
    if (interval > 1) return `${interval} days ago`
    if (interval === 1) return '1 day ago'
    
    interval = Math.floor(seconds / 3600)
    if (interval > 1) return `${interval} hours ago`
    if (interval === 1) return '1 hour ago'
    
    interval = Math.floor(seconds / 60)
    if (interval > 1) return `${interval} minutes ago`
    if (interval === 1) return '1 minute ago'
    
    return 'just now'
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Bell className="w-4 h-4 text-blue-500" />
    }
  }

  // Calculate stats from real data
  const totalLessons = lessons.length
  const publishedLessons = lessons.filter(l => l.isPublished).length
  const draftLessons = lessons.filter(l => !l.isPublished).length
  const languages = [...new Set(lessons.map(l => l.language?.name))].filter(Boolean).length
  
  // Find last updated lesson
  const lastUpdated = lessons.length > 0 
    ? new Date(Math.max(...lessons.map(l => new Date(l.updatedAt).getTime()))).toLocaleDateString()
    : 'N/A'

  // Active quarters calculation (mock data)
  const activeQuarters = 4
  const lessonsThisWeek = 3

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Manage Sabbath School lessons and system activity
        </p>
      </div>

      {/* API Status Warning */}
      {!apiAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start mb-6">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="text-yellow-800 font-medium">Database Connection Issue</h3>
            <p className="text-yellow-700 text-sm mt-1">
              Unable to connect to the database. Displaying sample data. Some features may not work as expected.
            </p>
            <p className="text-yellow-700 text-sm mt-2">
              Please ensure PostgreSQL is running on port 5432 and the database is properly configured.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Admin Actions */}
        <div className="space-y-6">
          {/* Admin Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Admin User</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">System Administrator</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">System Operational</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                asChild 
                variant="outline" 
                className="w-full justify-start border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Link href="/admin/lessons/upload">
                  <Upload className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Upload Lesson</span>
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="w-full justify-start border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Link href="/admin/lessons">
                  <FileSearch className="w-4 h-4 mr-2 text-green-500" />
                  <span>Manage Lessons</span>
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="w-full justify-start border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Link href="/admin/settings">
                  <Settings className="w-4 h-4 mr-2 text-purple-500" />
                  <span>System Settings</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Center Column - Main Content */}
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Lessons</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLessons}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Quarters</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeQuarters}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lessons This Week</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{lessonsThisWeek}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{lastUpdated}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start pb-4 last:pb-0 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()} {activity.target}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No recent activity
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Notifications & Resources */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View All
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                <ul className="space-y-3">
                  {notifications.map((notification) => (
                    <li 
                      key={notification.id} 
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        notification.read 
                          ? 'bg-gray-50 dark:bg-gray-700/50' 
                          : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30'
                      }`}
                    >
                      <div className="flex items-start">
                        {getNotificationIcon(notification.type)}
                        <div className="ml-3 flex-1">
                          <p className={`text-sm font-medium ${
                            notification.read 
                              ? 'text-gray-900 dark:text-gray-200' 
                              : 'text-blue-800 dark:text-blue-200'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No new notifications
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Resources */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Admin Resources</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                <span>System Logs</span>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <HelpCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>Admin Help</span>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FileDocument className="w-4 h-4 mr-2 text-purple-500" />
                <span>Documentation</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" />
          <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    Delete Lesson
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this lesson? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <Button
                onClick={confirmDelete}
                className="w-full sm:ml-3 sm:w-auto bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="mt-3 w-full sm:mt-0 sm:w-auto dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}