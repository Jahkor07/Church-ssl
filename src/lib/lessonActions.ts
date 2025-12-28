// Utility functions for lesson actions

// Fetch lessons by quarter
export async function fetchLessonsByQuarter(year: number, quarter: string) {
  try {
    // Properly encode the parameters
    const params = new URLSearchParams({
      year: year.toString(),
      quarter: quarter
    });
    
    const response = await fetch(`https://church-ssl-backend.onrender.com/api/lessons/lesson?${params.toString()}`);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Received non-JSON response from server');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, response.statusText, errorText);
      throw new Error(`Failed to fetch lessons: ${response.status} ${response.statusText}. Details: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Transform the data to match the expected format in the frontend
    // The external API returns different field names
    const transformedData = Array.isArray(data) ? data.map(lesson => ({
      id: lesson.lessonId,
      lessonId: lesson.lessonId,
      title: lesson.title,
      year: lesson.year,
      quarter: lesson.quarter,
      introduction: lesson.introduction,
      keywords: lesson.keywords,
      language: lesson.language,
      dailySections: lesson.dailySections,
      description: lesson.introduction?.substring(0, 100) + '...', // Create a description from introduction
      sections: lesson.dailySections || [], // Map daily sections to sections for compatibility
      isPublished: true, // Default to true for display purposes
    })) : [];
    
    return transformedData;
  } catch (error: any) {
    console.error('Error fetching lessons by quarter:', error);
    
    // If it's a network error, provide more context
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('NETWORK_ERROR: Unable to connect to the lesson API. Please check your internet connection and try again.');
    }
    
    throw error;
  }
}

// Delete a single lesson
export async function deleteLesson(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/lessons/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      console.error(error.error || 'Failed to delete lesson')
      return false
    }

    console.log('Lesson deleted successfully')
    return true
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return false
  }
}

// Delete multiple lessons
export async function deleteLessons(ids: string[]): Promise<boolean> {
  try {
    const response = await fetch('/api/lessons/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error(error.error || 'Failed to delete lessons')
      return false
    }

    const result = await response.json()
    console.log(result.message || 'Lessons deleted successfully')
    return true
  } catch (error) {
    console.error('Error deleting lessons:', error)
    return false
  }
}

// Search lessons
export async function searchLessons(query: string, page: number = 1, limit: number = 10) {
  try {
    // If query is empty, we still want to get all lessons
    const queryString = query ? `q=${encodeURIComponent(query)}&` : '';
    const response = await fetch(`/api/lessons/search?${queryString}page=${page}&limit=${limit}`)
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Received non-JSON response from server')
    }
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to search lessons')
    }
    
    return await response.json()
  } catch (error: any) {
    console.error('Error searching lessons:', error)
    
    // If it's a network error (likely database connection issue), return empty data
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Network error - likely database connection issue
      // Return safe fallback instead of throwing error
      return { lessons: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNextPage: false, hasPrevPage: false } }
    }
    
    // If it's a database connection error from the server side
    if (error.message && (error.message.includes('Can\'t reach database') || 
                          error.message.includes('Connection') || 
                          error.message.includes('connect') ||
                          error.message.includes('ECONNREFUSED') ||
                          error.message.includes('Authentication failed'))) {
      // Return safe fallback instead of throwing error
      return { lessons: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNextPage: false, hasPrevPage: false } }
    }
    
    // If it's a general database error, provide a more user-friendly message
    if (error.message && error.message.includes('Failed to search lessons')) {
      // Return safe fallback instead of throwing error
      return { lessons: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNextPage: false, hasPrevPage: false } }
    }
    
    // If we get a 500 error from the server, it's likely a database issue
    if (error.message && error.message.includes('Internal Server Error')) {
      // Return safe fallback instead of throwing error
      return { lessons: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNextPage: false, hasPrevPage: false } }
    }
    
    // For any other error, return safe fallback
    return { lessons: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNextPage: false, hasPrevPage: false } }
  }
}