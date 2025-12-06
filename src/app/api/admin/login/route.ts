import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

    // Call the external authentication API
    const authResponse = await fetch('http://localhost:9000/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      return NextResponse.json(
        { error: errorData.message || 'Invalid credentials' },
        { status: authResponse.status }
      );
    }

    const authData = await authResponse.json();
    const token = authData.jwt;

    // Set the token in a secure, httpOnly cookie
    (await cookies()).set('admin-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Return success response
    return NextResponse.json({
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}