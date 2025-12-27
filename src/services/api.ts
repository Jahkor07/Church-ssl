// API service layer for frontend-only architecture
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('/api') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Mock data for the application
const mockData = {
  dashboard: {
    totalLessons: 42,
    totalUsers: 128,
    totalLanguages: 5,
    recentLessons: [
      { id: '1', title: 'Introduction to Faith', date: '2024-01-15', language: 'English' },
      { id: '2', title: 'Understanding Grace', date: '2024-01-10', language: 'Spanish' },
      { id: '3', title: 'Living a Christian Life', date: '2024-01-05', language: 'French' },
    ],
    stats: {
      published: 32,
      draft: 10,
      archived: 0,
    }
  },
  lessons: [
    {
      lessonId: 'lesson-1',
      title: 'Welcome to Our Church',
      description: 'An introduction to our church community and values',
      content: 'Welcome to our church family! We are excited to have you join us on this spiritual journey...',
      year: 2024,
      quarter: 'Q1',
      introduction: 'Welcome!',
      keywords: 'welcome, introduction, church',
      language: {
        languageId: 'lang-1',
        languageName: 'English'
      },
      isPublished: true,
      order: 1,
      sections: [
        {
          id: 'section-1',
          day: 'Monday',
          content: 'Content for Monday section',
          bibleTexts: 'John 3:16',
          order: 1
        }
      ]
    },
    {
      lessonId: 'lesson-2',
      title: 'Foundations of Faith',
      description: 'Building your spiritual foundation',
      content: 'In this lesson we explore the fundamental principles of faith...',
      year: 2024,
      quarter: 'Q1',
      introduction: 'Building your foundation',
      keywords: 'faith, foundation, principles',
      language: {
        languageId: 'lang-1',
        languageName: 'English'
      },
      isPublished: true,
      order: 2,
      sections: [
        {
          id: 'section-2',
          day: 'Tuesday',
          content: 'Content for Tuesday section',
          bibleTexts: 'Matthew 7:24-27',
          order: 1
        }
      ]
    }
  ],
  languages: [
    { id: 'lang-1', name: 'English', code: 'en', flag: '🇺🇸', isActive: true },
    { id: 'lang-2', name: 'Spanish', code: 'es', flag: '🇪🇸', isActive: true },
    { id: 'lang-3', name: 'French', code: 'fr', flag: '🇫🇷', isActive: true },
    { id: 'lang-4', name: 'German', code: 'de', flag: '🇩🇪', isActive: true },
    { id: 'lang-5', name: 'Portuguese', code: 'pt', flag: '🇵🇹', isActive: true },
  ],
  notifications: [
    { id: 'notif-1', title: 'New Lesson Added', message: 'A new lesson has been added to the system', type: 'info', read: false, createdAt: '2024-01-15T10:30:00Z' },
    { id: 'notif-2', title: 'Quarterly Update', message: 'Q1 lessons have been published', type: 'success', read: true, createdAt: '2024-01-10T09:15:00Z' },
    { id: 'notif-3', title: 'System Maintenance', message: 'Scheduled maintenance on Friday', type: 'warning', read: false, createdAt: '2024-01-08T14:20:00Z' },
  ],
  users: [
    { id: 'user-1', name: 'Admin User', email: 'admin@church.com', role: 'admin', createdAt: '2024-01-01' },
    { id: 'user-2', name: 'Moderator User', email: 'mod@church.com', role: 'moderator', createdAt: '2024-01-02' },
  ]
};

// Dashboard API functions
export const getDashboardData = async () => {
  // In a real app, this would be: return await apiRequest('/dashboard');
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData.dashboard), 300); // Simulate network delay
  });
};

// Lessons API functions
export const getLessons = async (filters?: { year?: number; quarter?: string; languageId?: string }) => {
  // In a real app, this would be: return await apiRequest(`/lessons?${new URLSearchParams(filters).toString()}`);
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      let lessons = [...mockData.lessons];
      
      if (filters) {
        if (filters.year) {
          lessons = lessons.filter(lesson => lesson.year === filters.year);
        }
        if (filters.quarter) {
          lessons = lessons.filter(lesson => lesson.quarter === filters.quarter);
        }
        if (filters.languageId) {
          lessons = lessons.filter(lesson => lesson.language.languageId === filters.languageId);
        }
      }
      
      resolve(lessons);
    }, 300); // Simulate network delay
  });
};

export const getLessonById = async (id: string) => {
  // In a real app, this would be: return await apiRequest(`/lessons/${id}`);
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const lesson = mockData.lessons.find(lesson => lesson.lessonId === id);
      resolve(lesson || null);
    }, 300); // Simulate network delay
  });
};

export const createLesson = async (lessonData: any) => {
  // In a real app, this would be: return await apiRequest('/lessons', { method: 'POST', body: JSON.stringify(lessonData) });
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLesson = {
        lessonId: `lesson-${Date.now()}`,
        ...lessonData,
        sections: lessonData.sections || []
      };
      mockData.lessons.push(newLesson);
      resolve(newLesson);
    }, 300); // Simulate network delay
  });
};

export const updateLesson = async (id: string, lessonData: any) => {
  // In a real app, this would be: return await apiRequest(`/lessons/${id}`, { method: 'PUT', body: JSON.stringify(lessonData) });
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockData.lessons.findIndex(lesson => lesson.lessonId === id);
      if (index !== -1) {
        mockData.lessons[index] = { ...mockData.lessons[index], ...lessonData };
        resolve(mockData.lessons[index]);
      } else {
        resolve(null);
      }
    }, 300); // Simulate network delay
  });
};

export const deleteLesson = async (id: string) => {
  // In a real app, this would be: return await apiRequest(`/lessons/${id}`, { method: 'DELETE' });
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockData.lessons.findIndex(lesson => lesson.lessonId === id);
      if (index !== -1) {
        mockData.lessons.splice(index, 1);
        resolve({ message: 'Lesson deleted successfully' });
      } else {
        resolve({ message: 'Lesson not found' });
      }
    }, 300); // Simulate network delay
  });
};

// Languages API functions
export const getLanguages = async () => {
  // In a real app, this would be: return await apiRequest('/languages');
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData.languages), 300); // Simulate network delay
  });
};

// Notifications API functions
export const getNotifications = async () => {
  // In a real app, this would be: return await apiRequest('/notifications');
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData.notifications), 300); // Simulate network delay
  });
};

export const markNotificationAsRead = async (id: string) => {
  // In a real app, this would be: return await apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const notification = mockData.notifications.find(notif => notif.id === id);
      if (notification) {
        notification.read = true;
      }
      resolve(notification);
    }, 300); // Simulate network delay
  });
};

// Users API functions
export const getUsers = async () => {
  // In a real app, this would be: return await apiRequest('/users');
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData.users), 300); // Simulate network delay
  });
};

// Search API function
export const searchLessons = async (query: string) => {
  // In a real app, this would be: return await apiRequest(`/lessons/search?q=${encodeURIComponent(query)}`);
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) {
        resolve(mockData.lessons);
      } else {
        const filtered = mockData.lessons.filter(lesson => 
          lesson.title.toLowerCase().includes(query.toLowerCase()) ||
          lesson.description.toLowerCase().includes(query.toLowerCase()) ||
          lesson.keywords.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }
    }, 300); // Simulate network delay
  });
};