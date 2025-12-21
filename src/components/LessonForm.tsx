'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Plus, Trash2, X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  introduction: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  year: z.number().int().min(2020).max(2030),
  languageId: z.string().min(1, 'Language is required'),
  isPublished: z.boolean().default(false).optional(),
  order: z.number().int().default(0).optional(),
  quarter: z.string().optional(),
  keywords: z.string().optional()
})

type LessonFormData = z.infer<typeof lessonSchema>

interface Language {
  id: string
  name: string
  code: string
  flag?: string
}

interface LessonFormProps {
  initialData?: Partial<LessonFormData> & { id?: string }
  isEditing?: boolean
}

// Update the interface for better typing
interface DailySection {
  id?: string;
  day: string;
  content: string;
  bibleTexts: string;
  order: number;
}

export default function LessonForm({ initialData, isEditing = false, singleColumn = false }: LessonFormProps & { singleColumn?: boolean }) {
  const router = useRouter()
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(false)
  const [introductionEditor, setIntroductionEditor] = useState<Editor | null>(null)
  const [contentEditor, setContentEditor] = useState<Editor | null>(null)
  const [previewData, setPreviewData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [lesson, setLesson] = useState<{
    dailySections: DailySection[]
  }>({
    dailySections: []
  })

  const [dailySection, setDailySection] = useState<DailySection>({
    day: 'Sunday',
    content: '',
    bibleTexts: '',
    order: 0,
    id: undefined
  })
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      introduction: initialData?.introduction || '',
      content: initialData?.content || '',
      year: initialData?.year || new Date().getFullYear(),
      languageId: initialData?.languageId || '',
      isPublished: initialData?.isPublished || false,
      order: initialData?.order || 0,
      quarter: initialData?.quarter || '',
      keywords: initialData?.keywords || ''
    }
  })

  // Watch all form fields for real-time preview updates
  const watchedFields = watch()

  // Update preview data when form fields change
  useEffect(() => {
    // Only update if languages is an array
    if (!Array.isArray(languages)) return;
    
    // Find the selected language object
    const selectedLanguage = languages.find(lang => lang.id === watchedFields.languageId) || {
      id: watchedFields.languageId,
      name: 'English',
      code: 'en'
    }

    // Format the preview data to match the required structure
    const formattedPreviewData = {
      title: watchedFields.title || '',
      year: watchedFields.year || new Date().getFullYear(),
      quarter: watchedFields.quarter || '',
      introduction: watchedFields.introduction || '',
      keywords: watchedFields.keywords || '',
      language: {
        languageId: selectedLanguage.id,
        name: selectedLanguage.name,
        code: selectedLanguage.code
      },
      dailySections: lesson.dailySections
    }

    setPreviewData(formattedPreviewData)
  }, [watchedFields.title, watchedFields.year, watchedFields.quarter, watchedFields.introduction, watchedFields.keywords, watchedFields.languageId, languages, lesson.dailySections])

  const watchedIntroduction = watch('introduction')
  const watchedContent = watch('content')

  useEffect(() => {
    fetchLanguages()
    
    // If editing, fetch the existing lesson data
    if (isEditing && initialData?.id) {
      fetchLessonData(initialData.id)
    }
  }, [])

  useEffect(() => {
    if (introductionEditor && watchedIntroduction !== introductionEditor.getHTML()) {
      introductionEditor.commands.setContent(watchedIntroduction || '')
    }
  }, [watchedIntroduction, introductionEditor])

  useEffect(() => {
    if (contentEditor && watchedContent !== contentEditor.getHTML()) {
      contentEditor.commands.setContent(watchedContent || '')
    }
  }, [watchedContent, contentEditor])

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/languages')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setLanguages(data)
    } catch (error) {
      console.error('Error fetching languages:', error)
      // Set fallback languages in case of API failure
      setLanguages([
        { id: 'en', name: 'English', code: 'en', flag: '🇺🇸' },
        { id: 'es', name: 'Spanish', code: 'es', flag: '🇪🇸' },
        { id: 'fr', name: 'French', code: 'fr', flag: '🇫🇷' }
      ])
    }
  }

  const fetchLessonData = async (lessonId: string) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch lesson data')
      }
      const data = await response.json()
      
      // Reset form with fetched data
      reset({
        title: data.title || '',
        description: data.description || '',
        introduction: data.introduction || '',
        content: data.content || '',
        year: data.year || new Date().getFullYear(),
        languageId: data.language?.languageId || '',
        isPublished: data.isPublished || false,
        order: data.order || 0,
        quarter: data.quarter || '',
        keywords: data.keywords || ''
      })
      
      // Set daily sections if they exist
      if (data.sections && Array.isArray(data.sections)) {
        // Sort sections by order field and filter out empty sections
        const sortedSections = data.sections
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          .map((section: any) => ({
            id: section.id,
            day: section.day || 'Sunday',
            content: section.content || '',
            bibleTexts: section.bibleTexts || '',
            order: section.order || 0
          }))
          .filter((section: DailySection) => section.day && section.content.trim() && section.bibleTexts.trim())
        
        setLesson(prev => ({
          ...prev,
          dailySections: sortedSections
        }))
      }
    } catch (error) {
      console.error('Error fetching lesson data:', error)
      setError('Failed to load lesson data')
    }
  }

  const onSubmit = async (data: LessonFormData) => {
    setLoading(true)
    setError(null)
    try {
      // Use Next.js API routes
      const url = isEditing ? `/api/lessons/${initialData?.id}` : '/api/lessons'
      const method = isEditing ? 'PUT' : 'POST'

      // Prepare daily sections for submission
      // Filter out any sections without required content
      const dailySections = lesson.dailySections
        .filter(section => section.day && section.content.trim() && section.bibleTexts.trim())
        .map(section => ({
          id: section.id,
          day: section.day,
          content: section.content,
          bibleTexts: section.bibleTexts,
          order: section.order
        }))

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data, 
          dailySections
        })
      })

      if (response.ok) {
        router.push('/admin/lessons')
      } else {
        const error = await response.json()
        setError(error.error || 'Failed to save lesson')
        console.error('Error saving lesson:', error)
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Error saving lesson:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleDailySectionChange = (field: keyof DailySection, value: string | number) => {
    // For content and bibleTexts fields, we don't trim immediately to allow users to type spaces
    // Trimming will happen when adding the section
    setDailySection(prev => ({ ...prev, [field]: value }))
  }

  const addDailySection = () => {
    // Validation
    if (!dailySection.day || !dailySection.content.trim() || !dailySection.bibleTexts.trim()) {
      setError('Please fill in all fields for the daily section')
      return
    }

    // Add to sections with proper ordering
    const newSection: DailySection = {
      ...dailySection,
      content: dailySection.content.trim(),
      bibleTexts: dailySection.bibleTexts.trim(),
      order: lesson.dailySections.length,
      // For new lessons, we don't need an ID since the backend will generate one
      // For editing, we preserve the ID if it exists
      id: dailySection.id
    }

    setLesson(prev => ({
      ...prev,
      dailySections: [...prev.dailySections, newSection]
    }))

    // Reset form
    setDailySection({
      day: 'Sunday',
      content: '',
      bibleTexts: '',
      order: 0
    })
    
    setError(null)
  }

  const removeDailySection = (index: number) => {
    setLesson(prev => ({
      ...prev,
      dailySections: prev.dailySections
        .filter((_, i) => i !== index)
        .map((section, i) => ({ ...section, order: i }))
    }))
  }

  const moveDailySection = (index: number, direction: 'up' | 'down') => {
    setLesson(prev => {
      const newSections = [...prev.dailySections]
      if (direction === 'up' && index > 0) {
        [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]]
      } else if (direction === 'down' && index < newSections.length - 1) {
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
      }
      // Update order values to maintain sequential numbering
      return {
        ...prev,
        dailySections: newSections.map((section, i) => ({ ...section, order: i }))
      }
    })
  }

  const RichTextEditor = ({ 
    editor, 
    setEditor, 
    placeholder, 
    fieldName 
  }: { 
    editor: Editor | null
    setEditor: (editor: Editor) => void
    placeholder: string
    fieldName: 'introduction' | 'content'
  }) => {
    useEffect(() => {
      if (!editor) {
        const newEditor = new Editor({
          extensions: [
            StarterKit,
            Placeholder.configure({
              placeholder
            })
          ],
          content: fieldName === 'introduction' ? watchedIntroduction : watchedContent,
          onUpdate: ({ editor }) => {
            setValue(fieldName, editor.getHTML())
          }
        })
        setEditor(newEditor)
      }
    }, [])

    if (!editor) return null

    return (
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <div className="border-b border-gray-300 dark:border-gray-600 p-2 flex space-x-1 bg-gray-50 dark:bg-gray-700">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 text-sm rounded ${
              editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            • List
          </button>
        </div>
        <div
          className="p-3 min-h-[200px] prose prose-sm max-w-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          ref={(ref) => {
            if (ref && editor) {
              ref.innerHTML = ''
              ref.appendChild(editor.view.dom)
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className={singleColumn ? "grid grid-cols-1 gap-8" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
      {/* Error Message */}
      {error && (
        <div className="col-span-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="Enter lesson title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Year *
            </label>
            <input
              type="number"
              id="year"
              {...register('year', { valueAsNumber: true })}
              min="2020"
              max="2030"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.year && (
              <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="quarter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quarter
            </label>
            <input
              type="text"
              id="quarter"
              {...register('quarter')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="e.g., Q1, Spring"
            />
            {errors.quarter && (
              <p className="mt-1 text-sm text-red-600">{errors.quarter.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Keywords
            </label>
            <input
              type="text"
              id="keywords"
              {...register('keywords')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="Enter keywords separated by commas"
            />
            {errors.keywords && (
              <p className="mt-1 text-sm text-red-600">{errors.keywords.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="languageId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Language *
          </label>
          <select
            id="languageId"
            {...register('languageId')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="" className="dark:bg-gray-700">Select a language</option>
            {Array.isArray(languages) && languages.map((lang) => (
              <option key={lang.id} value={lang.id} className="dark:bg-gray-700">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          {errors.languageId && (
            <p className="mt-1 text-sm text-red-600">{errors.languageId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Introduction
          </label>
          <RichTextEditor
            editor={introductionEditor}
            setEditor={setIntroductionEditor}
            placeholder="Enter lesson introduction..."
            fieldName="introduction"
          />
          {errors.introduction && (
            <p className="mt-1 text-sm text-red-600">{errors.introduction.message}</p>
          )}
        </div>
        
        {/* Daily Sections */}
        <div className="col-span-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Daily Study Sections
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {lesson.dailySections.length} section{lesson.dailySections.length !== 1 ? 's' : ''} added
            </span>
          </div>

          {/* Add Daily Section Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Section
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Day of Week
                </label>
                <select
                  value={dailySection.day}
                  onChange={(e) => handleDailySectionChange('day', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {days.map(day => (
                    <option key={day} value={day} className="dark:bg-gray-700">{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bible Text Reference
                </label>
                <input
                  type="text"
                  value={dailySection.bibleTexts}
                  onChange={(e) => handleDailySectionChange('bibleTexts', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                  placeholder="e.g., Joshua 7:16-19, Romans 12:1-2"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Study Content
              </label>
              <textarea
                value={dailySection.content}
                onChange={(e) => handleDailySectionChange('content', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter the daily study content..."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addDailySection}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Plus size={18} /> Add Section
              </button>
            </div>
          </div>
          
          {/* Daily Sections List */}
          {lesson.dailySections.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Added Sections
              </h3>
              
              <div className="space-y-4">
                {lesson.dailySections.map((section, index) => (
                  <div 
                    key={section.id || `section-${index}`} 
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {section.day}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {section.bibleTexts}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {lesson.dailySections.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => moveDailySection(index, 'up')}
                              disabled={index === 0}
                              className={`p-2 rounded-full ${index === 0 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600'}`}
                              title="Move up"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => moveDailySection(index, 'down')}
                              disabled={index === lesson.dailySections.length - 1}
                              className={`p-2 rounded-full ${index === lesson.dailySections.length - 1 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600'}`}
                              title="Move down"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => removeDailySection(index)}
                          className="p-2 rounded-full text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                          title="Remove section"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-gray-700 dark:text-gray-300 text-sm">
                      {section.content.substring(0, 100)}{section.content.length > 100 ? '...' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/lessons')}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-lg"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Lesson' : 'Create Lesson'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}