// This file is kept for compatibility but no longer used
// All data operations now go through the API service in src/services/api.ts

// Placeholder export to avoid breaking existing imports
export const prisma = {
  lesson: {},
  language: {},
  admin: {},
  section: {},
  notification: {}
};

// Type definitions for mock prisma client
export type PrismaClientType = typeof prisma;


