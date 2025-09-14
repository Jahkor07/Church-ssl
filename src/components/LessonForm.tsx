'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  introduction: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  year: z.number().int().min(2020).max(2030),
  languageId: z.string().min(1, 'Language is required'),
  isPublished: z.boolean().default(false),
  order: z.number().int().default(0)
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
      order: initialData?.order || 0
    }
  })

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
      const url = isEditing ? `/api/lessons/${initialData?.id}` : '/api/lessons'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Brief description of the lesson"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
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

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Daily Lesson Content *
        </label>
        <RichTextEditor
          editor={contentEditor}
          setEditor={setContentEditor}
          placeholder="Enter the main lesson content..."
          fieldName="content"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700">
            Order
          </label>
          <input
            type="number"
            id="order"
            {...register('order', { valueAsNumber: true })}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.order && (
            <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            {...register('isPublished')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
            Publish immediately
          </label>
        </div>
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
  )
}


