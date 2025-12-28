// Updated to connect to external API
import { getLessons, getLessonById, searchLessons } from '../api';

const API_BASE_URL = 'https://church-ssl-backend.onrender.com/api';

export const lessonService = {
  // Fetch lessons by year and quarter
  async getLessonsByQuarter(year, quarter) {
    try {
      // Connect to external API
      // Properly encode the parameters
      const params = new URLSearchParams({
        year: year.toString(),
        quarter: quarter
      });
      const response = await fetch(`${API_BASE_URL}/lessons/lesson?${params.toString()}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, response.statusText, errorText);
        throw new Error(`Failed to fetch lessons: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match the expected format in the frontend
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
    } catch (error) {
      console.error(`Error fetching lessons for ${year} ${quarter}:`, error);
      throw error;
    }
  },

  // Fetch all available years
  async getAllYears() {
    try {
      // Connect to external API
      const response = await fetch(`${API_BASE_URL}/lessons/lesson/years`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch years: ${response.status} ${response.statusText}`);
      }
      
      const years = await response.json();
      return years;
    } catch (error) {
      console.error('Error fetching years:', error);
      throw error;
    }
  },

  // Fetch lessons with filters
  async getLessonsWithFilters(filters = {}) {
    try {
      // Connect to external API
      const queryParams = new URLSearchParams();
      
      if (filters.year !== undefined) queryParams.append('year', filters.year);
      if (filters.quarter) queryParams.append('quarter', filters.quarter);
      if (filters.languageId !== undefined) queryParams.append('languageId', filters.languageId);
      if (filters.page !== undefined) queryParams.append('page', filters.page);
      if (filters.size !== undefined) queryParams.append('size', filters.size);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/lessons/lesson${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, response.statusText, errorText);
        throw new Error(`Failed to fetch lessons: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }
      
      const lessons = await response.json();
      return lessons;
    } catch (error) {
      console.error('Error fetching lessons with filters:', error);
      throw error;
    }
  },

  // Fetch lesson by ID
  async getLessonById(id) {
    try {
      // Connect to external API
      const response = await fetch(`${API_BASE_URL}/lessons/lesson/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lesson: ${response.status} ${response.statusText}`);
      }
      
      const lesson = await response.json();
      return lesson;
    } catch (error) {
      console.error(`Error fetching lesson with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new lesson
  async createLesson(lessonData) {
    try {
      // Connect to external API
      console.log('Sending lesson data:', lessonData); // Debug logging
      
      const response = await fetch(`${API_BASE_URL}/lessons/lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, response.statusText, errorText);
        throw new Error(`Failed to create lesson: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }
      
      const lesson = await response.json();
      console.log('Lesson created successfully:', lesson); // Debug logging
      return lesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  },

  // Update a lesson
  async updateLesson(id, lessonData) {
    try {
      // Connect to external API (PUT request to the same endpoint)
      console.log('Sending update lesson data:', { lessonId: id, ...lessonData }); // Debug logging
      
      const response = await fetch(`${API_BASE_URL}/lessons/lesson`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId: id, ...lessonData })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, response.statusText, errorText);
        throw new Error(`Failed to update lesson: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }
      
      const lesson = await response.json();
      console.log('Lesson updated successfully:', lesson); // Debug logging
      return lesson;
    } catch (error) {
      console.error(`Error updating lesson with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a lesson
  async deleteLesson(id) {
    try {
      // Connect to external API
      const response = await fetch(`${API_BASE_URL}/lessons/lesson/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete lesson: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error deleting lesson with ID ${id}:`, error);
      throw error;
    }
  },

  // Search lessons
  async searchLessons(query) {
    try {
      // Connect to external API
      const params = new URLSearchParams({
        q: query
      });
      const response = await fetch(`${API_BASE_URL}/lessons/lesson/search?${params.toString()}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, response.statusText, errorText);
        throw new Error(`Failed to search lessons: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }
      
      const results = await response.json();
      return results;
    } catch (error) {
      console.error(`Error searching lessons with query ${query}:`, error);
      throw error;
    }
  },
};

export default lessonService;