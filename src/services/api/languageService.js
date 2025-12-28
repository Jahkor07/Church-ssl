// Updated to connect to external API

const API_BASE_URL = 'https://church-ssl-backend.onrender.com/api';

export const languageService = {
  // Fetch all active languages
  async getAllLanguages() {
    try {
      // Connect to external API
      const response = await fetch(`${API_BASE_URL}/languages`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, response.statusText, errorText);
        throw new Error(`Failed to fetch languages: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match the expected format in the frontend
      const transformedData = Array.isArray(data) ? data.map(lang => ({
        id: lang.languageId,
        languageId: lang.languageId,
        name: lang.languageName,
        languageName: lang.languageName,
        code: lang.languageId, // Use languageId as the code
        isActive: true, // Default to true for display purposes
        createdAt: new Date().toISOString(), // Use current date as default
        updatedAt: new Date().toISOString(), // Use current date as default
      })) : [];
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw error;
    }
  },

  // Fetch language by ID
  async getLanguageById(id) {
    try {
      // Connect to external API
      const response = await fetch(`${API_BASE_URL}/languages/${id}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, response.statusText, errorText);
        throw new Error(`Failed to fetch language: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match the expected format in the frontend
      const transformedData = {
        id: data.languageId,
        languageId: data.languageId,
        name: data.languageName,
        languageName: data.languageName,
        code: data.languageId,
        isActive: data.isActive || true,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
      
      return transformedData;
    } catch (error) {
      console.error(`Error fetching language with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new language
  async createLanguage(languageData) {
    try {
      // Connect to external API
      const response = await fetch(`${API_BASE_URL}/languages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(languageData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, response.statusText, errorText);
        throw new Error(`Failed to create language: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match the expected format in the frontend
      const transformedData = {
        id: data.languageId,
        languageId: data.languageId,
        name: data.languageName,
        languageName: data.languageName,
        code: data.languageId,
        isActive: data.isActive || true,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
      
      return transformedData;
    } catch (error) {
      console.error('Error creating language:', error);
      throw error;
    }
  },

  // Update a language
  async updateLanguage(id, languageData) {
    try {
      // Connect to external API
      const response = await fetch(`${API_BASE_URL}/languages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(languageData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, response.statusText, errorText);
        throw new Error(`Failed to update language: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match the expected format in the frontend
      const transformedData = {
        id: data.languageId,
        languageId: data.languageId,
        name: data.languageName,
        languageName: data.languageName,
        code: data.languageId,
        isActive: data.isActive || true,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
      
      return transformedData;
    } catch (error) {
      console.error(`Error updating language with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a language
  async deleteLanguage(id) {
    try {
      // Connect to external API
      const response = await fetch(`${API_BASE_URL}/languages/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, response.statusText, errorText);
        throw new Error(`Failed to delete language: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }
      
      // Some DELETE endpoints return no content (204 status)
      if (response.status === 204) {
        return { success: true, message: 'Language deleted successfully' };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error deleting language with ID ${id}:`, error);
      throw error;
    }
  },
};

export default languageService;