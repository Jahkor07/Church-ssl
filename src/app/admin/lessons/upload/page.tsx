'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react'
import { API_BASE_URL } from '@/lib/config'

function getQuarter(date: Date) {
    const month = date.getMonth() + 1; // getMonth() is 0-indexed
    if (month >= 1 && month <= 3) return 'Q1';
    if (month >= 4 && month <= 6) return 'Q2';
    if (month >= 7 && month <= 9) return 'Q3';
    if (month >= 10 && month <= 12) return 'Q4';
    return ''; // Should not happen with valid date
}

export default function UploadLessonPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lessonDate: '',
    keywords: '',
    languageId: ''
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
  const [languages, setLanguages] = useState<{ languageId: string; languageName: string }[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/languages');
        if (response.ok) {
          const data = await response.json();
          setLanguages(data);
        } else {
          console.error('Failed to fetch languages');
        }
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, []);

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
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields: Title and Description')
      setIsSubmitting(false)
      return
    }
    
    let lessonYear: number | undefined;
    let lessonQuarter: string = '';

    if (formData.lessonDate) {
        const date = new Date(formData.lessonDate);
        if (!isNaN(date.getTime())) { // Check if date is valid
            lessonYear = date.getFullYear();
            lessonQuarter = getQuarter(date);
        }
    }

    const lessonPayload = {
      title: formData.title,
      introduction: formData.description,
      year: lessonYear,
      quarter: lessonQuarter,
      language: {
        languageId: formData.languageId
      },
      dailySections: lesson.dailySections.map(ds => ({
        day: ds.day,
        content: ds.content,
        bibleTexts: ds.bibleTexts
      })),
      keywords: formData.keywords
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/lessons/lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-auth-token')}`
        },
        body: JSON.stringify(lessonPayload),
      });

      if (response.ok) {
        alert('Lesson created successfully!');
        router.push('/admin/lessons');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Network error or unexpected issue:', error);
      alert('An error occurred while creating the lesson. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
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
                  <div>
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

                  <div>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
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

                  <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords
                    </label>
                    <input
                      type="text"
                      id="keywords"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., faith, grace, salvation"
                    />
                  </div>

                  <div>
                    <label htmlFor="languageId" className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      id="languageId"
                      name="languageId"
                      value={formData.languageId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Language</option>
                      {languages.map(lang => (
                        <option key={lang.languageId} value={lang.languageId}>
                          {lang.languageName}
                        </option>
                      ))}
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
              <h3 className="text-sm font-medium text-gray-500">Lesson Date</h3>
              <p className="text-gray-900">{formData.lessonDate || 'No date selected'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Keywords</h3>
              <p className="text-gray-900">{formData.keywords || 'No keywords entered'}</p>
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

          </div>
        </div>
      </div>
    </div>
  )
}
