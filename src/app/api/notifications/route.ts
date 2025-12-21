import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/notifications - Get all notifications
export async function GET() {
  try {
    // Check if prisma is properly initialized
    if (!prisma || !prisma.notification) {
      console.error('Prisma client not properly initialized');
      return NextResponse.json([]);
    }
    
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // Limit to 20 most recent notifications
    });

    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    // Return empty array if database is unavailable
    return NextResponse.json([]);
  }
}

// POST /api/notifications - Create a new notification (internal use only)
export async function POST(request: Request) {
  try {
    // Check if prisma is properly initialized
    if (!prisma || !prisma.notification) {
      console.error('Prisma client not properly initialized');
      return NextResponse.json({ success: true });
    }
    
    const body = await request.json();
    const { title, message, type = 'info' } = body;

    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        read: false
      }
    });

    return NextResponse.json(notification);
  } catch (error: any) {
    console.error('Error creating notification:', error);
    // Fail silently if database is unavailable
    return NextResponse.json({ success: true });
  }
}