'use client';

import { useState, useEffect } from 'react';

interface ExternalLesson {
  id: number;
  title: string;
  description: string;
  content: string;
  year: number;
  quarter: string;
  language: string;
}

export default function ExternalApiDemo() {
  const [lessons, setLessons] = useState<ExternalLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    content: '',
    year: new Date().getFullYear(),
    quarter: 'Q1',
    language: 'English'
  });

  // Fetch data from external API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/external');
        const result = await response.json();
        
        if (result.success) {
          setLessons(result.data);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submission to send data to external API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/external', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLesson),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Add the new lesson to the list
        setLessons([...lessons, { ...newLesson, id: Date.now() }]);
        // Reset form
        setNewLesson({
          title: '',
          description: '',
          content: '',
          year: new Date().getFullYear(),
          quarter: 'Q1',
          language: 'English'
        });
        alert('Lesson submitted successfully!');
      } else {
        setError(result.error || 'Failed to submit lesson');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">External API Integration Demo</h2>
        <p className="mb-4">This component demonstrates how to integrate with external APIs in your Church SSL application.</p>
      </div>

      {/* Form to submit new lesson */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Add New Lesson</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              value={newLesson.title}
              onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={newLesson.description}
              onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                id="year"
                value={newLesson.year}
                onChange={(e) => setNewLesson({...newLesson, year: parseInt(e.target.value) || new Date().getFullYear()})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
              />
            </div>
            
            <div>
              <label htmlFor="quarter" className="block text-sm font-medium text-gray-700">Quarter</label>
              <select
                id="quarter"
                value={newLesson.quarter}
                onChange={(e) => setNewLesson({...newLesson, quarter: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
              >
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
              <input
                type="text"
                id="language"
                value={newLesson.language}
                onChange={(e) => setNewLesson({...newLesson, language: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Lesson
          </button>
        </form>
      </div>

      {/* Display fetched lessons */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Fetched Lessons</h3>
        {lessons.length === 0 ? (
          <p>No lessons found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-lg mb-2">{lesson.title}</h4>
                <p className="text-gray-600 text-sm mb-2">{lesson.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{lesson.year} {lesson.quarter}</span>
                  <span>{lesson.language}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions for integrating with real API */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Integration Instructions</h3>
        <ul className="list-disc pl-5 space-y-1 text-blue-700">
          <li>Replace the mock API implementation in <code className="bg-blue-100 px-1 rounded">src/app/api/external/route.ts</code> with actual API calls</li>
          <li>Add authentication headers if required by your external API</li>
          <li>Handle rate limiting and error responses appropriately</li>
          <li>Consider implementing caching for better performance</li>
        </ul>
      </div>
    </div>
  );
}