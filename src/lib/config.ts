// Configuration file for API endpoints
const CONFIG = {
  // Use ngrok URL for external testing, fallback to localhost for development
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  
  // Admin login endpoint
  ADMIN_LOGIN_ENDPOINT: '/api/admin/login',
};

export default CONFIG;