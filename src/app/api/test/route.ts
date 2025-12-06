import { NextResponse } from 'next/server';

// GET /api/test - Simple test endpoint
export async function GET() {
  return NextResponse.json({ 
    message: 'API is working correctly',
    timestamp: new Date().toISOString()
  });
}