// Updated to use the new API service
import { getLessons, getLessonById, createLesson, updateLesson, deleteLesson, searchLessons } from '../api';

export const lessonService = {
  // Fetch lessons by year and quarter
  async getLessonsByQuarter(year, quarter) {
    try {
      // Using the new API service
      const lessons = await getLessons({ year, quarter });
      return lessons;
    } catch (error) {
      console.error(`Error fetching lessons for ${year} ${quarter}:`, error);
      throw error;
    }
  },

  // Fetch all available years
  async getAllYears() {
    try {
      // Using the new API service - return mock years
      return [2023, 2024, 2025];
    } catch (error) {
      console.error('Error fetching years:', error);
      throw error;
    }
  },

  // Fetch lessons with filters
  async getLessonsWithFilters(filters = {}) {
    try {
      // Using the new API service
      const lessons = await getLessons(filters);
      return lessons;
    } catch (error) {
      console.error('Error fetching lessons with filters:', error);
      throw error;
    }
  },

  // Fetch lesson by ID
  async getLessonById(id) {
    try {
      // Using the new API service
      const lesson = await getLessonById(id);
      return lesson;
    } catch (error) {
      console.error(`Error fetching lesson with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new lesson
  async createLesson(lessonData) {
    try {
      // Using the new API service
      const lesson = await createLesson(lessonData);
      return lesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  },

  // Update a lesson
  async updateLesson(id, lessonData) {
    try {
      // Using the new API service
      const lesson = await updateLesson(id, lessonData);
      return lesson;
    } catch (error) {
      console.error(`Error updating lesson with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a lesson
  async deleteLesson(id) {
    try {
      // Using the new API service
      const result = await deleteLesson(id);
      return result;
    } catch (error) {
      console.error(`Error deleting lesson with ID ${id}:`, error);
      throw error;
    }
  },

  // Search lessons
  async searchLessons(query) {
    try {
      // Using the new API service
      const results = await searchLessons(query);
      return results;
    } catch (error) {
      console.error(`Error searching lessons with query ${query}:`, error);
      throw error;
    }
  },
};

export default lessonService;