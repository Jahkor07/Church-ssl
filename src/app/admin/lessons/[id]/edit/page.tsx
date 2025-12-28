'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, X, Trash2 } from 'lucide-react'
import LessonForm from '@/components/LessonForm'
import { lessonService } from '@/services/api/lessonService'

export default function EditLessonPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await lessonService.getLessonById(params.id);
        setLesson(data);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLesson();
  }, [params.id]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      try {
        await lessonService.deleteLesson(params.id);
        alert('Lesson deleted successfully');
        router.push('/admin/lessons');
      } catch (err) {
        console.error('Error deleting lesson:', err);
        alert('Failed to delete lesson');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2">Loading lesson...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Lesson</h1>
          <p className="mt-2 text-sm text-gray-700">
            Update an existing lesson with rich text content and multi-language support.
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Lesson
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <LessonForm initialData={lesson} isEditing={true} />
        </div>
      </div>
    </div>
  )
}