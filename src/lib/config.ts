const isProduction = process.env.NODE_ENV === 'production';

export const API_BASE_URL = isProduction 
  ? process.env.NEXT_PUBLIC_API_BASE_URL || 'https://church-ssl-backend.onrender.com' 
  : '/api/proxy';
