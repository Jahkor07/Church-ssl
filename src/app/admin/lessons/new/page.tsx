'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, X, Upload as UploadIcon, Plus, Trash2 } from 'lucide-react'
import LessonForm from '@/components/LessonForm'

export default function NewLessonPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload New Lesson</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Create a new lesson with rich text content and multi-language support.
        </p>
      </div>

      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        <div className="px-4 py-5 sm:p-8">
          <div className="max-w-4xl mx-auto w-full">
            <LessonForm />
          </div>
        </div>
      </div>
    </div>
  )
}


