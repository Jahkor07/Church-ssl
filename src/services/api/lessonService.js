import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle relative URLs
apiClient.interceptors.request.use((config) => {
  // If baseURL is empty, use relative URLs
  if (!API_BASE_URL) {
    config.baseURL = '';
    // Ensure the URL starts with /api
    if (!config.url.startsWith('/api')) {
      config.url = '/api' + config.url;
    }
  } else {
    // Ensure there's no double slash between base URL and endpoint
    config.url = config.url.replace(/\/\/+/, '/');
  }
  return config;
});

export const lessonService = {
  // Fetch lessons by year and quarter
  async getLessonsByQuarter(year, quarter) {
    try {
      const response = await apiClient.get(`/lessons/by-quarter?year=${year}&quarter=${quarter}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lessons for ${year} ${quarter}:`, error);
      throw error;
    }
  },

  // Fetch all available years
  async getAllYears() {
    try {
      const response = await apiClient.get('/lessons/years');
      return response.data;
    } catch (error) {
      console.error('Error fetching years:', error);
      throw error;
    }
  },

  // Fetch lessons with filters
  async getLessonsWithFilters(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.year !== undefined) queryParams.append('year', filters.year);
      if (filters.quarter) queryParams.append('quarter', filters.quarter);
      if (filters.languageId !== undefined) queryParams.append('languageId', filters.languageId);
      if (filters.page !== undefined) queryParams.append('page', filters.page);
      if (filters.size !== undefined) queryParams.append('size', filters.size);
      
      const queryString = queryParams.toString();
      const url = `/lessons${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching lessons with filters:', error);
      throw error;
    }
  },

  // Fetch lesson by ID
  async getLessonById(id) {
    try {
      const response = await apiClient.get(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lesson with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new lesson
  async createLesson(lessonData) {
    try {
      const response = await apiClient.post('/lessons', lessonData);
      return response.data;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  },

  // Update a lesson
  async updateLesson(id, lessonData) {
    try {
      const response = await apiClient.put(`/lessons/${id}`, lessonData);
      return response.data;
    } catch (error) {
      console.error(`Error updating lesson with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a lesson
  async deleteLesson(id) {
    try {
      const response = await apiClient.delete(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting lesson with ID ${id}:`, error);
      throw error;
    }
  },
};

export default lessonService;