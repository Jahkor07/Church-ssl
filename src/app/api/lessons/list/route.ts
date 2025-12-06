import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/lessons/list - Get all lessons
export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        language: true,
        sections: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    
    // Return mock data if database is not available
    return NextResponse.json([
      {
        id: 'mock-lesson-1',
        title: 'Sample Lesson',
        description: 'This is a sample lesson for testing',
        content: 'Lesson content goes here...',
        year: 2024,
        quarter: 'Q1',
        language: {
          id: 'en',
          name: 'English',
          code: 'en'
        },
        sections: [
          {
            id: 'section-1',
            day: 'Sunday',
            content: 'Sunday study content',
            bibleTexts: 'John 3:16'
          }
        ]
      }
    ]);
  }
}