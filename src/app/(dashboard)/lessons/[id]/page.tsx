'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bookmark, Share2, Download, StickyNote } from 'lucide-react'

// Mock lesson data
const mockLesson = {
  id: '1',
  title: 'The Beginning of the Gospel',
  subtitle: 'Understanding the foundation of our faith',
  date: '2024-01-06',
  quarter: 'Q1 2024',
  week: 'Week 1',
  content: `
    <h2>Introduction</h2>
    <p>Welcome to our study of the Gospel of Mark. This quarter, we will explore the foundational truths that form the bedrock of our Christian faith. The Gospel of Mark, believed to be the earliest written Gospel, presents Jesus Christ as the Son of God and the Savior of the world.</p>
    
    <h3>The Opening Declaration</h3>
    <p>Mark begins his Gospel with a powerful declaration: "The beginning of the gospel of Jesus Christ, the Son of God" (Mark 1:1). This opening statement sets the tone for everything that follows. The word "gospel" means "good news," and Mark is about to share the greatest news the world has ever heard.</p>
    
    <h3>Key Themes</h3>
    <p>Throughout our study, we will encounter several key themes:</p>
    <ul>
      <li><strong>Jesus as the Messiah:</strong> Mark presents Jesus as the long-awaited Messiah, fulfilling Old Testament prophecies.</li>
      <li><strong>The Kingdom of God:</strong> Jesus came to establish God's kingdom on earth.</li>
      <li><strong>Discipleship:</strong> Following Jesus requires commitment and sacrifice.</li>
      <li><strong>Faith and Action:</strong> True faith is demonstrated through our actions.</li>
    </ul>
    
    <h3>Practical Application</h3>
    <p>As we study this Gospel, let us ask ourselves: How does this message of hope and salvation impact our daily lives? How can we share this good news with others? The Gospel is not just a historical account; it is a living message that transforms lives today.</p>
    
    <h3>Memory Verse</h3>
    <blockquote>
      <p>"The beginning of the gospel of Jesus Christ, the Son of God." - Mark 1:1</p>
    </blockquote>
    
    <h3>Discussion Questions</h3>
    <ol>
      <li>What does the word "gospel" mean to you personally?</li>
      <li>How has the good news of Jesus Christ changed your life?</li>
      <li>What are some ways you can share this good news with others?</li>
    </ol>
  `,
  notes: ''
}

export default function LessonDetailPage({ params }: { params: { id: string } }) {
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const [selectedText, setSelectedText] = useState('')

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem(`lesson-${params.id}-notes`)
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [params.id])

  const saveNotes = (newNotes: string) => {
    setNotes(newNotes)
    localStorage.setItem(`lesson-${params.id}-notes`, newNotes)
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
              <span>{mockLesson.quarter}</span>
              <span>•</span>
              <span>{mockLesson.week}</span>
              <span>•</span>
              <span>{new Date(mockLesson.date).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {mockLesson.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {mockLesson.subtitle}
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
                dangerouslySetInnerHTML={{ __html: mockLesson.content }}
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

