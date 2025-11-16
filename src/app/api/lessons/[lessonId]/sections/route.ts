import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';

// POST /api/lessons/[lessonId]/sections - Create a new section under a lesson
export async function POST(req: NextRequest, { params }: { params: { lessonId: string } }) {
  try {
    const { userId } = getAuth(req);
    
    // Check if user is authenticated (admin only)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = params;

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const body = await req.json();
    const { day, content, bibleTexts } = body;

    // Validate required fields
    if (!day || !content || !bibleTexts) {
      return NextResponse.json(
        { error: 'Missing required fields: day, content, bibleTexts' },
        { status: 400 }
      );
    }

    // Create the section
    const section = await prisma.section.create({
      data: {
        day,
        content,
        bibleTexts,
        lesson: {
          connect: {
            id: lessonId
          }
        }
      }
    });

    // Return the created section with the proper response format
    return NextResponse.json({
      sectionId: section.id,
      day: section.day,
      content: section.content,
      bibleTexts: section.bibleTexts,
      lesson: {
        lessonId: lesson.id
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}