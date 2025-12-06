import { NextResponse } from 'next/server';

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

    // Return success response with token
    return NextResponse.json({
      message: 'Login successful',
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}