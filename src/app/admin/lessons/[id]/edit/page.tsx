'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, X } from 'lucide-react'
import LessonForm from '@/components/LessonForm'

export default function EditLessonPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Lesson</h1>
        <p className="mt-2 text-sm text-gray-700">
          Update an existing lesson with rich text content and multi-language support.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <LessonForm initialData={{ id: params.id }} isEditing={true} />
        </div>
      </div>
    </div>
  )
}