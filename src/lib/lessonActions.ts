// Utility functions for lesson actions

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
    // Construct URL with proper query parameters
    const url = new URL('/api/lessons/search', window.location.origin);
    
    if (query) {
      url.searchParams.append('q', query);
    }
    
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    
    console.log('Fetching from URL:', url.toString());
    
    const response = await fetch(url.toString());
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200) + '...');
      throw new Error(`Received non-JSON response from server. Status: ${response.status}`);
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to search lessons');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching lessons:', error);
    throw error;
  }
}
