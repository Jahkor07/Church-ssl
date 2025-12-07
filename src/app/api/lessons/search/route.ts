import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { type NextRequest } from 'next/server';

// GET /api/lessons/search?q=searchTerm - Search lessons
export async function GET(req: NextRequest) {
  try {
    console.log('Search API called');
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    console.log('Query params:', { query, page, limit });
    
    const skip = (page - 1) * limit;
    
    // Define search conditions
    const searchConditions = query ? {
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          content: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          keywords: {
            contains: query,
            mode: 'insensitive'
          }
        }
      ]
    } : {};
    
    console.log('Search conditions:', searchConditions);
    
    // Search lessons by title, description, content, or keywords
    const lessons = await prisma.lesson.findMany({
      where: searchConditions,
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
      },
      skip,
      take: limit
    });
    
    console.log('Found lessons:', lessons.length);
    
    // Get total count for pagination
    const totalCount = await prisma.lesson.count({
      where: searchConditions
    });
    
    console.log('Total count:', totalCount);
    
    const result = {
      lessons: lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        year: lesson.year,
        quarter: lesson.quarter,
        isPublished: lesson.isPublished,
        createdAt: lesson.createdAt.toISOString(),
        updatedAt: lesson.updatedAt.toISOString(),
        language: {
          name: lesson.language.name
        }
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      }
    };
    
    console.log('Returning result');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error searching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to search lessons: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}