import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';

// POST /api/sections - Create a new section (flat endpoint)
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    // Check if user is authenticated (admin only)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { day, content, bibleTexts, lesson } = body;

    // Validate required fields
    if (!day || !content || !bibleTexts || !lesson || !lesson.lessonId) {
      return NextResponse.json(
        { error: 'Missing required fields: day, content, bibleTexts, lesson.lessonId' },
        { status: 400 }
      );
    }

    // Check if lesson exists
    const lessonExists = await prisma.lesson.findUnique({
      where: {
        id: lesson.lessonId
      }
    });

    if (!lessonExists) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Create the section
    const section = await prisma.section.create({
      data: {
        day,
        content,
        bibleTexts,
        lesson: {
          connect: {
            id: lesson.lessonId
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
        lessonId: lesson.lessonId
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