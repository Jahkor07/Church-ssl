import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/lessons/search?q=searchTerm - Search lessons
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const skip = (page - 1) * limit;
    
    // Define search conditions
    const searchConditions: any = query ? {
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
    
    // Get total count for pagination
    const totalCount = await prisma.lesson.count({
      where: searchConditions
    });
    
    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Error searching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to search lessons' },
      { status: 500 }
    );
  }
}