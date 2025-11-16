import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';

// POST /api/lessons - Create a new lesson
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, content, introduction, year, quarter, keywords, languageId } = body;

    // Validate required fields
    if (!title || !content || !year || !quarter || !languageId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, year, quarter, languageId' },
        { status: 400 }
      );
    }

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description: description || null,
        content: content || '',
        introduction: introduction || null,
        year,
        quarter,
        keywords: keywords || null,
        language: {
          connect: {
            id: languageId
          }
        }
      },
      include: {
        language: true
      }
    });

    // Return the created lesson with the proper response format
    return NextResponse.json({
      lessonId: lesson.id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      year: lesson.year,
      quarter: lesson.quarter,
      introduction: lesson.introduction,
      keywords: lesson.keywords,
      language: {
        languageId: lesson.languageId,
        languageName: lesson.language.name
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}

// GET /api/lessons/[id] - Get a specific lesson by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        id
      },
      include: {
        language: true
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Return the lesson with the proper response format
    return NextResponse.json({
      lessonId: lesson.id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      year: lesson.year,
      quarter: lesson.quarter,
      introduction: lesson.introduction,
      keywords: lesson.keywords,
      language: {
        languageId: lesson.languageId,
        languageName: lesson.language.name
      }
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

// PUT /api/lessons/[id] - Update a specific lesson by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req);
    
    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { title, description, content, introduction, year, quarter, keywords, languageId, isPublished, order } = body;

    // Validate required fields
    if (!title || !content || !year || !quarter || !languageId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, year, quarter, languageId' },
        { status: 400 }
      );
    }

    // Update the lesson
    const lesson = await prisma.lesson.update({
      where: {
        id
      },
      data: {
        title,
        description: description || null,
        content: content || '',
        introduction: introduction || null,
        year,
        quarter,
        keywords: keywords || null,
        isPublished: isPublished !== undefined ? isPublished : false,
        order: order !== undefined ? order : 0,
        language: {
          connect: {
            id: languageId
          }
        }
      },
      include: {
        language: true
      }
    });

    // Return the updated lesson with the proper response format
    return NextResponse.json({
      lessonId: lesson.id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      year: lesson.year,
      quarter: lesson.quarter,
      introduction: lesson.introduction,
      keywords: lesson.keywords,
      language: {
        languageId: lesson.languageId,
        languageName: lesson.language.name
      },
      isPublished: lesson.isPublished,
      order: lesson.order
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

// DELETE /api/lessons/[id] - Delete a specific lesson by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req);
    
    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Delete the lesson
    await prisma.lesson.delete({
      where: {
        id
      }
    });

    // Return success response
    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}