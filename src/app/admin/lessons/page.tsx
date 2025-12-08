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
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800'
  }

  const getStatusText = (isPublished: boolean) => {
    return isPublished ? 'Published' : 'Draft'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lessons</h1>
          <p className="mt-2 text-gray-600">
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

      {/* API Status Warning */}
      {!apiAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
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

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
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
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 appearance-none"
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
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 appearance-none"
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <Database className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Lessons Table */}
      {!loading && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              All Lessons ({lessons.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-normal max-w-xs">
                      <div className="text-sm font-medium text-gray-900">
                        {lesson.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {lesson.year}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Globe className="w-4 h-4 mr-1" />
                        {lesson.language?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lesson.isPublished)}`}>
                        {getStatusText(lesson.isPublished)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lesson.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/lessons/${lesson.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/lessons/${lesson.id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(lesson.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No lessons found
          </h3>
          <p className="text-gray-600 mb-4">
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
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Delete Lesson
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this lesson? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <Button
                  onClick={confirmDelete}
                  className="w-full sm:ml-3 sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}