'use client'

import { useState, useEffect } from 'react'
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
  Search,
  Filter,
  AlertCircle,
  Database
} from 'lucide-react'
import { deleteLesson, searchLessons } from '@/lib/lessonActions'
import { useTheme } from '@/contexts/ThemeContext'

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
  },
  {
    id: '3',
    title: 'The Kingdom of God',
    year: 2024,
    language: { name: 'English' },
    isPublished: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
  }
]

export default function AdminLessonsPage() {
  const { theme } = useTheme()
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiAvailable, setApiAvailable] = useState<boolean>(false)
  const router = useRouter()

  // Fetch lessons from API
  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      setLoading(true)
      const result = await searchLessons('', 1, 100) // Get all lessons for now
      
      // If we get a successful response, update state
      if (result && result.lessons) {
        setLessons(result.lessons)
        setApiAvailable(true)
        setError(null)
      }
    } catch (err: any) {
      console.error('API Error:', err)
      
      // Check if it's a database connection error
      if (err.message === 'DATABASE_CONNECTION_ERROR') {
        // Use mock data when API is not available
        setLessons(mockLessons)
        setApiAvailable(false)
        setError('Unable to connect to the database. Displaying sample data. Some features may not work as expected.')
      } else {
        // Use mock data for any other error
        setLessons(mockLessons)
        setApiAvailable(false)
        setError('Failed to load lessons. Displaying sample data.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (lessonId: string) => {
    setLessonToDelete(lessonId)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (lessonToDelete) {
      try {
        // Only try to delete if API is available
        if (apiAvailable) {
          const success = await deleteLesson(lessonToDelete)
          if (success) {
            // Remove the lesson from the local state
            setLessons(lessons.filter(lesson => lesson.id !== lessonToDelete))
          } else {
            setError('Failed to delete lesson')
          }
        } else {
          // For mock data, just remove from state
          setLessons(lessons.filter(lesson => lesson.id !== lessonToDelete))
        }
        
        setShowDeleteModal(false)
        setLessonToDelete(null)
      } catch (err) {
        console.error('Error deleting lesson:', err)
        setError('Failed to delete lesson')
      }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lessons</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your church lessons and educational content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/lessons/new">
            <Plus className="w-4 h-4 mr-2" />
            Create New Lesson
          </Link>
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <Link
            href="/admin/lessons"
            className="border-indigo-500 text-indigo-600 dark:text-indigo-400 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            All Lessons
          </Link>
          <Link
            href="/admin/lessons/by-quarter"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            By Quarter
          </Link>
        </nav>
      </div>

      {/* API Status Warning */}
      {!apiAvailable && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="text-yellow-800 dark:text-yellow-200 font-medium">Database Connection Issue</h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
              Unable to connect to the database. Displaying sample data. Some features may not work as expected.
            </p>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-2">
              Please ensure PostgreSQL is running on port 5432 and the database is properly configured.
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
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

          {/* Year Filter */}
          <div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option value="All">All Years</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
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
                <option value="All">All Languages</option>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>Portuguese</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <Database className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Lessons Table */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              All Lessons ({lessons.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-normal max-w-xs">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {lesson.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {lesson.year}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Globe className="w-4 h-4 mr-1" />
                        {lesson.language?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lesson.isPublished)}`}>
                        {getStatusText(lesson.isPublished)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(lesson.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/lessons/${lesson.id}`)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/lessons/${lesson.id}/edit`)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(lesson.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && lessons.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
          <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No lessons found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get started by creating a new lesson
          </p>
          <Button asChild>
            <Link href="/admin/lessons/new">
              <Plus className="w-4 h-4 mr-2" />
              Create New Lesson
            </Link>
          </Button>
        </div>
      )}

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