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
  } catch (error) {
    console.error('Error searching lessons:', error)
    throw error
  }
}