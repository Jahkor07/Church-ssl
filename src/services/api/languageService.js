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
  }
  return config;
});

export const languageService = {
  // Fetch all active languages
  async getAllLanguages() {
    try {
      const response = await apiClient.get('/languages');
      return response.data;
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw error;
    }
  },

  // Fetch language by ID
  async getLanguageById(id) {
    try {
      const response = await apiClient.get(`/languages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching language with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new language
  async createLanguage(languageData) {
    try {
      const response = await apiClient.post('/languages', languageData);
      return response.data;
    } catch (error) {
      console.error('Error creating language:', error);
      throw error;
    }
  },

  // Update a language
  async updateLanguage(id, languageData) {
    try {
      const response = await apiClient.put(`/languages/${id}`, languageData);
      return response.data;
    } catch (error) {
      console.error(`Error updating language with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a language
  async deleteLanguage(id) {
    try {
      const response = await apiClient.delete(`/languages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting language with ID ${id}:`, error);
      throw error;
    }
  },
};

export default languageService;