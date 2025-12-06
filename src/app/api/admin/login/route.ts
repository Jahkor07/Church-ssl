import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/login - Admin login endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // For demo purposes, we'll accept the default admin/password combination
    // In a production app, you would validate against the database
    const isValidAdmin = username === 'admin' && password === 'password';
    
    if (!isValidAdmin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return success response with token
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: 1,
        username: 'admin',
        role: 'ADMIN'
      },
      token: 'admin-jwt-token-example' // In a real app, this would be a proper JWT
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}