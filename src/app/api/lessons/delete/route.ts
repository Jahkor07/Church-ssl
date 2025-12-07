import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';

// POST /api/lessons/delete - Delete multiple lessons by IDs
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    
    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { ids } = body;

    // Validate input
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid lesson IDs' },
        { status: 400 }
      );
    }

    // Delete multiple lessons
    await prisma.lesson.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    // Return success response
    return NextResponse.json({ 
      message: `${ids.length} lesson(s) deleted successfully`,
      deletedIds: ids
    });
  } catch (error) {
    console.error('Error deleting lessons:', error);
    return NextResponse.json(
      { error: 'Failed to delete lessons' },
      { status: 500 }
    );
  }
}