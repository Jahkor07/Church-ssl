'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { lessonService } from '@/services/api/lessonService';

// Memoized lesson card component for performance
const LessonCard = memo(({ lesson }: { lesson: any }) => (
  <div 
    key={lesson.lessonId || lesson.id} 
    className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800"
  >
    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
      {lesson.title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
      {lesson.description || lesson.introduction?.substring(0, 100) + '...' || 'No description available'}
    </p>
    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
      <span>Language: {lesson.language?.languageName || lesson.language?.name || 'Unknown'}</span>
      <span>
        {lesson.isPublished ? (
          <span className="text-green-600 dark:text-green-400">Published</span>
        ) : (
          <span className="text-yellow-600 dark:text-yellow-400">Draft</span>
        )}
      </span>
    </div>
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
        {lesson.dailySections?.length || lesson.sections?.length || 0} sections
      </span>
    </div>
  </div>
));

LessonCard.displayName = 'LessonCard';

export default function LessonsByQuarterPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(new Date().getFullYear().toString()); // Use current year instead of hardcoded 2026
  const [quarter, setQuarter] = useState('Q1');

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert year to number and fetch lessons using the service function
      const lessonsData = await lessonService.getLessonsByQuarter(parseInt(year), quarter);
      setLessons(lessonsData);
      
      // Check if we received an empty array
      if (lessonsData.length === 0) {
        setError('No lessons found');
      }
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('Failed to load lessons. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [year, quarter]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    fetchLessons();
  }, [fetchLessons]);

  return (
    <AdminLayout>
      <div className="py-6 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Centered content container */}
          <div className="rounded-lg shadow p-4 sm:p-6 mx-auto">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="2020"
                  max="2030"
                />
              </div>
              
              <div>
                <label htmlFor="quarter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quarter
                </label>
                <select
                  id="quarter"
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="Q1">Q1 (January - March)</option>
                  <option value="Q2">Q2 (April - June)</option>
                  <option value="Q3">Q3 (July - September)</option>
                  <option value="Q4">Q4 (October - December)</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                <span className="text-gray-600 dark:text-gray-400">Loading lessons...</span>
              </div>
            ) : error && lessons.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 max-w-2xl mx-auto">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">{error}</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                    If you're using ngrok, make sure it's running and properly configured. 
                    For local development, the API should be accessible at /api/lessons/by-quarter.
                  </p>
                </div>
              </div>
            ) : lessons.length > 0 ? (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Found {lessons.length} lesson(s) for {year} {quarter}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {lessons.map((lesson) => (
                    <LessonCard key={lesson.id} lesson={lesson} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}