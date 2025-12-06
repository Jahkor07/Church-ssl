'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Plus, Trash2 } from 'lucide-react'

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

export default function LessonForm({ initialData, isEditing = false }: LessonFormProps) {
  const router = useRouter()
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(false)
  const [introductionEditor, setIntroductionEditor] = useState<Editor | null>(null)
  const [contentEditor, setContentEditor] = useState<Editor | null>(null)
  const [previewData, setPreviewData] = useState<any>(null)
  
  const [lesson, setLesson] = useState({
    dailySections: [] as { day: string; content: string; bibleTexts: string }[]
  })
  
  const [dailySection, setDailySection] = useState({
    day: 'Sunday',
    content: '',
    bibleTexts: ''
  })
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
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
  }, [watchedFields, languages, lesson.dailySections])

  const watchedIntroduction = watch('introduction')
  const watchedContent = watch('content')

  useEffect(() => {
    fetchLanguages()
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
      const data = await response.json()
      setLanguages(data)
    } catch (error) {
      console.error('Error fetching languages:', error)
    }
  }

  const onSubmit = async (data: LessonFormData) => {
    setLoading(true)
    try {
      // Use Next.js API routes
      const url = isEditing ? `/api/lessons/${initialData?.id}` : '/api/lessons'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, dailySections: lesson.dailySections})
      })

      if (response.ok) {
        router.push('/admin/lessons')
      } else {
        const error = await response.json()
        console.error('Error saving lesson:', error)
      }
    } catch (error) {
      console.error('Error saving lesson:', error)
    } finally {
      setLoading(false)
    }
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
      <div className="border border-gray-300 rounded-md">
        <div className="border-b border-gray-300 p-2 flex space-x-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 text-sm rounded ${
              editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 text-sm rounded ${
              editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 text-sm rounded ${
              editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            List
          </button>
        </div>
        <div
          className="p-3 min-h-[200px] prose prose-sm max-w-none"
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter lesson title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year *
            </label>
            <input
              type="number"
              id="year"
              {...register('year', { valueAsNumber: true })}
              min="2020"
              max="2030"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.year && (
              <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="quarter" className="block text-sm font-medium text-gray-700">
              Quarter
            </label>
            <input
              type="text"
              id="quarter"
              {...register('quarter')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., Q1, Spring"
            />
            {errors.quarter && (
              <p className="mt-1 text-sm text-red-600">{errors.quarter.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
              Keywords
            </label>
            <input
              type="text"
              id="keywords"
              {...register('keywords')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter keywords separated by commas"
            />
            {errors.keywords && (
              <p className="mt-1 text-sm text-red-600">{errors.keywords.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="languageId" className="block text-sm font-medium text-gray-700">
            Language *
          </label>
          <select
            id="languageId"
            {...register('languageId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a language</option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          {errors.languageId && (
            <p className="mt-1 text-sm text-red-600">{errors.languageId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
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
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Daily Sections
            </label>
          </div>
          
          {/* Add Daily Section Form */}
          <div className="space-y-4 mt-4">
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

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Lesson' : 'Create Lesson'}
          </button>
        </div>
      </form>

      {/* JSON Preview */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
          JSON Preview
        </h2>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-auto max-h-[calc(100vh-200px)]">
          <pre className="text-sm text-gray-800 dark:text-gray-200">
            {JSON.stringify(previewData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
