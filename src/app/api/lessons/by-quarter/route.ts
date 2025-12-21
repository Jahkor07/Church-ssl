import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to add CORS headers
function setCORSHeaders(response: Response) {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  const response = new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
  return response;
}

// Generate mock lessons for a specific year and quarter
function generateMockLessonsForQuarter(year: number, quarter: string, count = 3) {
  const mockLessons = [];
  const languages = [
    { id: '1', name: 'English', code: 'en' },
    { id: '2', name: 'Spanish', code: 'es' },
    { id: '3', name: 'French', code: 'fr' }
  ];
  
  for (let i = 1; i <= count; i++) {
    const language = languages[Math.floor(Math.random() * languages.length)];
    mockLessons.push({
      id: `lesson-${year}-${quarter}-${i}`,
      title: `Lesson ${i}: ${quarter} ${year} Study`,
      description: `Study material for ${quarter} ${year}, lesson ${i}.`,
      year: year,
      quarter: quarter,
      language: language,
      isPublished: Math.random() > 0.3,
      order: i,
      createdAt: new Date(year, (parseInt(quarter[1]) - 1) * 3, 1).toISOString(),
      updatedAt: new Date(year, (parseInt(quarter[1]) - 1) * 3, 1).toISOString(),
      sections: [
        {
          id: `section-${year}-${quarter}-${i}-1`,
          day: 'Sunday',
          content: `<p>Sunday study content for lesson ${i}.</p>`,
          bibleTexts: 'John 3:16',
          order: 1
        },
        {
          id: `section-${year}-${quarter}-${i}-2`,
          day: 'Monday',
          content: `<p>Monday study content for lesson ${i}.</p>`,
          bibleTexts: 'Romans 12:1-2',
          order: 2
        }
      ]
    });
  }
  
  return mockLessons;
}

// GET /api/lessons/by-quarter?year=2026&quarter=Q1 - Get lessons by year and quarter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const quarter = searchParams.get('quarter');
    
    // Validate required parameters
    if (!year || !quarter) {
      const response = NextResponse.json(
        { error: 'Missing required parameters: year and quarter' },
        { status: 400 }
      );
      return setCORSHeaders(response);
    }
    
    // Convert year to integer
    const yearInt = parseInt(year);
    if (isNaN(yearInt)) {
      const response = NextResponse.json(
        { error: 'Invalid year parameter. Must be a number.' },
        { status: 400 }
      );
      return setCORSHeaders(response);
    }
    
    // Validate quarter format
    if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
      const response = NextResponse.json(
        { error: 'Invalid quarter parameter. Must be one of: Q1, Q2, Q3, Q4' },
        { status: 400 }
      );
      return setCORSHeaders(response);
    }
    
    // Try to fetch from database first
    try {
      // Fetch lessons by year and quarter
      const lessons = await prisma.lesson.findMany({
        where: {
          year: yearInt,
          quarter: quarter
        },
        include: {
          language: true,
          sections: {
            orderBy: {
              order: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      // Format the response
      const formattedLessons = lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        year: lesson.year,
        quarter: lesson.quarter,
        language: {
          id: lesson.language.id,
          name: lesson.language.name,
          code: lesson.language.code
        },
        isPublished: lesson.isPublished,
        order: lesson.order,
        createdAt: lesson.createdAt.toISOString(),
        updatedAt: lesson.updatedAt.toISOString(),
        sections: lesson.sections.map((section: any) => ({
          id: section.id,
          day: section.day,
          content: section.content,
          bibleTexts: section.bibleTexts,
          order: section.order
        }))
      }));
      
      const response = NextResponse.json({
        success: true,
        data: formattedLessons,
        count: formattedLessons.length,
        year: yearInt,
        quarter: quarter
      });
      
      return setCORSHeaders(response);
    } catch (dbError) {
      // If database connection fails, return mock data
      console.warn('Database connection failed, returning mock data:', dbError);
      
      const mockLessons = generateMockLessonsForQuarter(yearInt, quarter, 3);
      
      const response = NextResponse.json({
        success: true,
        data: mockLessons,
        count: mockLessons.length,
        year: yearInt,
        quarter: quarter
      });
      
      return setCORSHeaders(response);
    }
  } catch (error: any) {
    console.error('Error fetching lessons by quarter:', error);
    
    const response = NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch lessons by quarter',
        data: [],
        count: 0
      },
      { status: 500 }
    );
    return setCORSHeaders(response);
  }
}