# API Integration Guide for Church SSL

This guide explains how to integrate external APIs into the Church SSL application.

## Current Implementation

The application includes a demo implementation of external API integration:

1. **API Route**: `/src/app/api/external/route.ts` - Handles external API calls
2. **Component**: `/src/components/ExternalApiDemo.tsx` - Demonstrates usage in the frontend
3. **Page**: `/src/app/admin/api-demo/page.tsx` - Displays the demo component

## How to Integrate Real APIs

### 1. Update the API Route

Modify `/src/app/api/external/route.ts` to connect to your actual API:

```typescript
// Replace the mock implementation with real API calls
const response = await fetch('https://your-api-endpoint.com/lessons', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### 2. Handle Authentication

If your API requires authentication, add the necessary headers:

```typescript
// Add to your fetch requests
headers: {
  'Authorization': 'Bearer YOUR_API_TOKEN',
  'X-API-Key': 'YOUR_API_KEY',
  'Content-Type': 'application/json'
}
```

### 3. Error Handling

Implement proper error handling for different scenarios:

```typescript
try {
  const response = await fetch(apiUrl, options);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API request failed:', error);
  throw error;
}
```

## Database Connection Issues

The application is currently showing "Failed to search lessons" because it cannot connect to the database. To fix this:

### Option 1: Use Docker (Recommended)

1. Install Docker Desktop
2. Start Docker Desktop
3. Run the following commands in your project directory:

```bash
docker-compose up -d
npm run db:generate
npm run db:push
```

### Option 2: Use Local PostgreSQL

1. Install PostgreSQL locally
2. Update your `.env` file with the correct connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/church_ssl?schema=public"
```

3. Run the database setup commands:

```bash
npm run db:generate
npm run db:push
```

## Testing the Integration

1. Start the development server:

```bash
npm run dev
```

2. Navigate to http://localhost:3000/admin/api-demo
3. You should see the API demo page with:
   - A form to submit new lessons
   - A list of fetched lessons
   - Instructions for integration

## Security Considerations

1. Never expose API keys in client-side code
2. Always use environment variables for sensitive data
3. Implement proper authentication and authorization
4. Validate and sanitize all input data
5. Handle rate limiting appropriately

## Best Practices

1. Implement caching for better performance
2. Use try-catch blocks for error handling
3. Log errors for debugging purposes
4. Implement proper loading states in the UI
5. Handle network timeouts gracefully
6. Validate API responses before using them

## Need Help?

If you need assistance with the Postman collection you shared, please provide:
1. The API endpoints you want to integrate
2. Authentication requirements
3. Expected request/response formats
4. Any specific functionality you want to implement

Then I can help you create the specific integration code for your needs.