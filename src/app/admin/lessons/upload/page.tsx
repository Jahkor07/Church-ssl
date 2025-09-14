'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, X } from 'lucide-react'

export default function UploadLessonPage() {
  const [formData, setFormData] = useState({
    title: '',
    year: '2024',
    language: 'English',
    introduction: '',
    dailyContent: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Mock submit - simulate API call
    setTimeout(() => {
      console.log('Lesson submitted:', formData)
      setIsSubmitting(false)
      router.push('/admin/dashboard')
    }, 2000)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Upload New Lesson</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Create a new lesson with rich content and multi-language support
        </p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700">
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
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
                  Creating Lesson...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Lesson
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
