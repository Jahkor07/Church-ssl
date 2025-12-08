'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, X, Upload as UploadIcon, Plus, Trash2 } from 'lucide-react'
import LessonForm from '@/components/LessonForm'

export default function UploadLessonPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Upload New Lesson</h1>
        <p className="mt-2 text-sm text-gray-700">
          Create a new lesson with rich text content and multi-language support.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <LessonForm />
        </div>
      </div>
    </div>
  )
}
