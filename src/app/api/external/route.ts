import { NextResponse } from 'next/server';

// Mock data representing what might come from an external API
const mockApiData = [
  {
    id: 1,
    title: "Introduction to Faith",
    description: "Understanding the basics of Christian faith",
    content: "This lesson covers the fundamental beliefs of Christianity...",
    year: 2024,
    quarter: "Q1",
    language: "English"
  },
  {
    id: 2,
    title: "Bible Study Methods",
    description: "Learn effective techniques for studying the Bible",
    content: "This lesson teaches various methods for Bible study...",
    year: 2024,
    quarter: "Q1",
    language: "English"
  },
  {
    id: 3,
    title: "Prayer Life",
    description: "Developing a meaningful prayer life",
    content: "This lesson explores different aspects of prayer...",
    year: 2024,
    quarter: "Q1",
    language: "English"
  }
];

// Helper function to add CORS headers
function setCORSHeaders(response: Response) {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  const response = new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
  return response;
}

// GET /api/external - Fetch data from external API (mocked)
export async function GET() {
  try {
    // In a real implementation, you would fetch from the external API:
    // const response = await fetch('https://external-api-endpoint.com/lessons');
    // const data = await response.json();
    
    // For now, we're returning mock data
    const response = NextResponse.json({
      success: true,
      data: mockApiData,
      message: "Data fetched successfully"
    });
    
    return setCORSHeaders(response);
  } catch (error) {
    console.error('Error fetching from external API:', error);
    
    const response = NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch data from external API',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
    
    return setCORSHeaders(response);
  }
}

// POST /api/external - Send data to external API (mocked)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real implementation, you would send data to the external API:
    // const response = await fetch('https://external-api-endpoint.com/lessons', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer YOUR_API_KEY'
    //   },
    //   body: JSON.stringify(body)
    // });
    // const result = await response.json();
    
    // For now, we're just echoing back the data
    const response = NextResponse.json({
      success: true,
      data: body,
      message: "Data sent to external API successfully"
    });
    
    return setCORSHeaders(response);
  } catch (error) {
    console.error('Error sending to external API:', error);
    
    const response = NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send data to external API',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
    
    return setCORSHeaders(response);
  }
}