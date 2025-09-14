'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, X } from 'lucide-react'

// Mock lesson data
const mockLesson = {
  id: '1',
  title: 'The Beginning of the Gospel',
  year: '2024',
  language: 'English',
  introduction: 'Welcome to our study of the Gospel of Mark. This quarter, we will explore the foundational truths that form the bedrock of our Christian faith.',
  dailyContent: `# The Opening Declaration

Mark begins his Gospel with a powerful declaration: "The beginning of the gospel of Jesus Christ, the Son of God" (Mark 1:1). This opening statement sets the tone for everything that follows.

## Key Themes

Throughout our study, we will encounter several key themes:

- **Jesus as the Messiah**: Mark presents Jesus as the long-awaited Messiah, fulfilling Old Testament prophecies.
- **The Kingdom of God**: Jesus came to establish God's kingdom on earth.
- **Discipleship**: Following Jesus requires commitment and sacrifice.
- **Faith and Action**: True faith is demonstrated through our actions.

## Practical Application

As we study this Gospel, let us ask ourselves: How does this message of hope and salvation impact our daily lives? How can we share this good news with others?

> "The beginning of the gospel of Jesus Christ, the Son of God." - Mark 1:1`
}

export default function EditLessonPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    title: '',
    year: '2024',
    language: 'English',
    introduction: '',
    dailyContent: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate loading lesson data
    setTimeout(() => {
      setFormData({
        title: mockLesson.title,
        year: mockLesson.year,
        language: mockLesson.language,
        introduction: mockLesson.introduction,
        dailyContent: mockLesson.dailyContent
      })
      setIsLoading(false)
    }, 500)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Mock update - simulate API call
    setTimeout(() => {
      console.log('Lesson updated:', { id: params.id, ...formData })
      setIsSubmitting(false)
      router.push('/admin/dashboard')
    }, 2000)
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Lesson</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Update lesson content and settings
        </p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter lesson title"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year *
                </label>
                <select
                  id="year"
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language *
              </label>
              <select
                id="language"
                name="language"
                required
                value={formData.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Portuguese">Portuguese</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>

          {/* Introduction */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Introduction
            </h2>
            
            <div>
              <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lesson Introduction
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-md">
                <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex space-x-1">
                  <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    Bold
                  </button>
                  <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    Italic
                  </button>
                  <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    List
                  </button>
                </div>
                <textarea
                  id="introduction"
                  name="introduction"
                  rows={6}
                  value={formData.introduction}
                  onChange={handleChange}
                  className="w-full p-3 border-0 focus:ring-0 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Write the lesson introduction here..."
                />
              </div>
            </div>
          </div>

          {/* Daily Content */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Daily Lesson Content *
            </h2>
            
            <div>
              <label htmlFor="dailyContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Main Content
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-md">
                <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex space-x-1">
                  <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    Bold
                  </button>
                  <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    Italic
                  </button>
                  <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    List
                  </button>
                  <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    Quote
                  </button>
                </div>
                <textarea
                  id="dailyContent"
                  name="dailyContent"
                  required
                  rows={12}
                  value={formData.dailyContent}
                  onChange={handleChange}
                  className="w-full p-3 border-0 focus:ring-0 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Write the main lesson content here..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.dailyContent}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating Lesson...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Lesson
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}