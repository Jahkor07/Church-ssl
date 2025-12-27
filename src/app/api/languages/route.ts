import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { type NextRequest } from 'next/server';

// GET /api/languages - Get all active languages
export async function GET() {
  try {
    const languages = await prisma.language.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(languages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}

// PUT /api/languages/:id - Update a language (toggle active status)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {


    const { id } = params;
    const body = await req.json();
    const { isActive } = body;

    // Validate required fields
    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive field is required and must be a boolean' },
        { status: 400 }
      );
    }

    // Update the language
    const language = await prisma.language.update({
      where: {
        id
      },
      data: {
        isActive
      }
    });

    return NextResponse.json(language);
  } catch (error) {
    console.error('Error updating language:', error);
    return NextResponse.json(
      { error: 'Failed to update language' },
      { status: 500 }
    );
  }
}