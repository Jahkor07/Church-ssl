// Validation script to test the searchLessons endpoint
async function testSearchLessons() {
  try {
    console.log('Testing searchLessons function...');
    
    // Test the environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log('NEXT_PUBLIC_API_URL:', apiUrl);
    
    // Test direct API call
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    let fullUrl;
    
    if (baseUrl) {
      // For absolute URLs, ensure proper concatenation
      fullUrl = `${baseUrl.replace(/\/$/, '')}/lessons/search?page=1&limit=5`;
    } else {
      // For relative URLs, use the standard path
      fullUrl = `/api/lessons/search?page=1&limit=5`;
    }
    
    console.log('Full URL to test:', fullUrl);
    
    // Test fetch call
    const response = await fetch(fullUrl);
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Received data:', JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.text();
      console.error('Error response:', errorData);
    }
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testSearchLessons();