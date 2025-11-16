'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, X, Upload as UploadIcon, Plus, Trash2 } from 'lucide-react'

export default function UploadLessonPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scriptureReference: '',
    lessonDate: '',
    category: 'Sunday',
    file: null as File | null,
    fileName: ''
  })
  
  const [lesson, setLesson] = useState({
    dailySections: [] as { day: string; content: string; bibleTexts: string }[]
  })
  
  const [dailySection, setDailySection] = useState({
    day: 'Sunday',
    content: '',
    bibleTexts: ''
  })
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleDailySectionChange = (field: string, value: string) => {
    setDailySection(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData(prev => ({
        ...prev,
        file: file,
        fileName: file.name
      }))
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setPreviewUrl(null)
      }
    }
  }
  
  const addDailySection = () => {
    if (dailySection.day && dailySection.content && dailySection.bibleTexts) {
      setLesson(prev => ({
        ...prev,
        dailySections: [...prev.dailySections, { ...dailySection }]
      }))

      setDailySection({
        day: 'Sunday',
        content: '',
        bibleTexts: ''
      })
    }
  }
  
  const removeDailySection = (index: number) => {
    setLesson(prev => ({
      ...prev,
      dailySections: prev.dailySections.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.scriptureReference) {
      alert('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }
    
    // Mock submit - simulate API call
    setTimeout(() => {
      console.log('Lesson submitted:', { ...formData, ...lesson })
      setIsSubmitting(false)
      router.push('/admin/lessons')
    }, 2000)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Upload New Lesson</h1>
        </div>
        <p className="text-gray-600">
          Create a new lesson with rich content and multimedia support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Lesson Information
                </h2>
                
                <div className="grid grid-cols-1 gap-6">
                  {/* Title - Full width */}
                  <div className="col-span-1 lg:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter lesson title"
                    />
                  </div>

                  {/* Description - Full width */}
                  <div className="col-span-1 lg:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter lesson description"
                    />
                  </div>

                  {/* Scripture Reference and Lesson Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="scriptureReference" className="block text-sm font-medium text-gray-700 mb-2">
                        Scripture Reference *
                      </label>
                      <input
                        type="text"
                        id="scriptureReference"
                        name="scriptureReference"
                        required
                        value={formData.scriptureReference}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., John 3:16-21"
                      />
                    </div>

                    <div>
                      <label htmlFor="lessonDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Lesson Date
                      </label>
                      <input
                        type="date"
                        id="lessonDate"
                        name="lessonDate"
                        value={formData.lessonDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Category - Full width */}
                  <div className="col-span-1 lg:col-span-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Sunday">Sunday School</option>
                      <option value="Midweek">Midweek Service</option>
                      <option value="Youth">Youth Ministry</option>
                      <option value="Children">Children's Ministry</option>
                      <option value="Special">Special Event</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Daily Sections */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Daily Sections
                </h2>
                
                {/* Add Daily Section Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Day</label>
                    <select
                      value={dailySection.day}
                      onChange={(e) => handleDailySectionChange('day', e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg"
                    >
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                    <textarea
                      value={dailySection.content}
                      onChange={(e) => handleDailySectionChange('content', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter the daily study content..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bible Texts</label>
                    <input
                      type="text"
                      value={dailySection.bibleTexts}
                      onChange={(e) => handleDailySectionChange('bibleTexts', e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg"
                      placeholder="Joshua 7:16-19"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addDailySection}
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus size={18} /> Add Section
                  </button>
                </div>
                
                {/* Daily Sections List */}
                {lesson.dailySections.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Added Sections ({lesson.dailySections.length})
                    </h3>

                    <div className="space-y-3">
                      {lesson.dailySections.map((section, index) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-semibold text-indigo-600">{section.day}</span>
                              <span className="text-gray-500 text-sm ml-2">• {section.bibleTexts}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeDailySection(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <p className="text-sm text-gray-700">
                            {section.content.substring(0, 150)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Attachment
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload PDF or Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-4 sm:pt-5 pb-4 sm:pb-6">
                        <UploadIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 text-gray-500" />
                        <p className="mb-1 sm:mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 px-2 text-center">
                          PDF, PNG, JPG, GIF (MAX. 10MB)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.png,.jpg,.jpeg,.gif"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {formData.fileName && (
                    <div className="mt-2 text-sm text-gray-600">
                      Selected file: {formData.fileName}
                    </div>
                  )}
                  {previewUrl && (
                    <div className="mt-4">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-32 sm:max-h-40 rounded-lg border border-gray-200 w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving Lesson...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Lesson
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Preview
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              <p className="text-gray-900">{formData.title || 'No title entered'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="text-gray-900">{formData.description || 'No description entered'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Scripture Reference</h3>
              <p className="text-gray-900">{formData.scriptureReference || 'No scripture reference entered'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Lesson Date</h3>
              <p className="text-gray-900">{formData.lessonDate || 'No date selected'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="text-gray-900">{formData.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Daily Sections</h3>
              <div className="mt-1 space-y-2">
                {lesson.dailySections.map((section, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-600">{section.day}</span>
                      <span className="text-xs text-gray-500">{section.bibleTexts}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{section.content}</p>
                  </div>
                ))}
                {lesson.dailySections.length === 0 && (
                  <p className="text-xs text-gray-500">No sections added</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Attachment</h3>
              <p className="text-gray-900">{formData.fileName || 'No file uploaded'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
