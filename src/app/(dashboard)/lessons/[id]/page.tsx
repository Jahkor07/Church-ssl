'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bookmark, Share2, Download, StickyNote } from 'lucide-react'
import { lessonService } from '@/services/api/lessonService'

export default function LessonDetailPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const lessonData = await lessonService.getLessonById(params.id);
        setLesson(lessonData);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLesson();
  }, [params.id]);
  
  useEffect(() => {
    // Load notes from localStorage
    if (lesson) {
      const savedNotes = localStorage.getItem(`lesson-${lesson.id}-notes`);
      if (savedNotes) {
        setNotes(savedNotes);
      }
    }
  }, [lesson]);
  // Remove duplicate state declarations - they're already defined above

  
  const saveNotes = (newNotes: string) => {
    setNotes(newNotes)
    if (lesson) {
      localStorage.setItem(`lesson-${lesson.id}-notes`, newNotes)
    }
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim())
    }
  }

  const addHighlight = () => {
    if (selectedText) {
      // In a real implementation, you would use Tiptap's highlight extension
      console.log('Highlighting text:', selectedText)
      setSelectedText('')
    }
  }
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading lesson...</p>
        </div>
      </div>
    );
  }
  
  if (error || !lesson) {
    return (
      <div className="max-w-7xl mx-auto py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error || 'Lesson not found'}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lessons
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{lesson?.year} {lesson?.quarter}</span>
              <span>•</span>
              <span>{lesson?.keywords}</span>
              <span>•</span>
              <span>{lesson?.language?.languageName || 'Unknown'}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {lesson?.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {lesson?.introduction?.substring(0, 100)}{lesson?.introduction?.length > 100 ? '...' : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-8">
              <div 
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ol:text-gray-700 dark:prose-ol:text-gray-300 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20"
                dangerouslySetInnerHTML={{ __html: lesson?.introduction || '' }}
                onMouseUp={handleTextSelection}
              />
            </div>
          </div>

          {/* Text Selection Actions */}
          {selectedText && (
            <div className="mt-4 flex items-center space-x-2">
              <Button size="sm" onClick={addHighlight}>
                Highlight
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedText('')}>
                Cancel
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Selected: "{selectedText.substring(0, 50)}{selectedText.length > 50 ? '...' : ''}"
              </span>
            </div>
          )}
        </div>

        {/* Notes Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <StickyNote className="w-4 h-4 mr-2" />
                    My Notes
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotes(!showNotes)}
                  >
                    {showNotes ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
              
              {showNotes && (
                <div className="p-4">
                  <textarea
                    value={notes}
                    onChange={(e) => saveNotes(e.target.value)}
                    placeholder="Write your personal notes here..."
                    className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {notes.length} characters • Auto-saved
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Bookmark this lesson
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share with group
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

