# Church SSL System Integration Checklist

## A) API Endpoints

Based on the requirements, here are the API endpoints with the base URL:
`https://myrl-readaptive-dedicatorily.ngrok-free.dev/api`

### Language Endpoints:
1. `GET /api/languages` - Fetch all active languages
2. `GET /api/languages/{id}` - Fetch language by ID
3. `POST /api/languages` - Create a new language
4. `PUT /api/languages/{id}` - Update a language
5. `DELETE /api/languages/{id}` - Delete a language

### Lesson Endpoints:
1. `GET /api/lessons/by-quarter?year=2026&quarter=Q1` - Fetch lessons by year and quarter
2. `GET /api/lessons/years` - Fetch all available years
3. `GET /api/lessons` - Fetch lessons with filters (year, quarter, languageId, page, size)
4. `GET /api/lessons/{id}` - Fetch lesson by ID
5. `POST /api/lessons` - Create a new lesson
6. `PUT /api/lessons/{id}` - Update a lesson
7. `DELETE /api/lessons/{id}` - Delete a lesson

## B) Spring Boot Backend Setup

### Prerequisites:
- Java 17+
- Maven
- PostgreSQL database

### Setup Steps:
1. Navigate to the `church-ssl-backend` directory
2. Update `src/main/resources/application.properties` with your database credentials
3. Run `mvn clean install` to build the project
4. Run `mvn spring-boot:run` to start the server
5. The backend will be available at `http://localhost:9000`

### Database Configuration:
The application will automatically create tables based on the entity classes.
Make sure PostgreSQL is running and the database `church_ssl` exists.

## C) Next.js Frontend Integration

### Environment Setup:
1. Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_API_URL=https://myrl-readaptive-dedicatorily.ngrok-free.dev/api
   ```

### Service Usage:
The services are located in `src/services/api/`:
- `languageService.js` for language operations
- `lessonService.js` for lesson operations

### Component Usage:
Example components are provided in `src/components/`:
- `LanguageList.js` - Fetch and display languages
- `LessonList.js` - Fetch and display lessons by quarter
- `LessonForm.js` - Create/update lessons

## D) Testing Checklist

### 1. How to Test All Endpoints:
- Use Postman to test each endpoint with the base URL
- Verify request/response formats match the expected structure
- Test error cases (invalid IDs, missing parameters, etc.)

### 2. How to Handle CORS:
- The Spring Boot backend includes CORS configuration allowing requests from localhost:3000
- Ensure the frontend uses the correct API base URL
- Check browser console for CORS errors

### 3. How to Handle JWT Tokens:
- For authenticated endpoints, include the Authorization header:
  ```
  Authorization: Bearer <your-jwt-token>
  ```
- The frontend services can be updated to include tokens:
  ```javascript
  const token = localStorage.getItem('authToken');
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  ```

### 4. How to Verify the ngrok API is Online:
- Visit `https://myrl-readaptive-dedicatorily.ngrok-free.dev/api/languages` in your browser
- You should see a response (even if empty) rather than a connection error
- Check the ngrok dashboard for tunnel status

## E) Deployment Checklist

### Backend Deployment:
1. Package the application: `mvn clean package`
2. Deploy the generated JAR file to your server
3. Set environment variables for database connection
4. Ensure the server is accessible on port 9000

### Frontend Deployment:
1. Update `.env.production` with the production API URL
2. Build the application: `npm run build`
3. Deploy the `build` directory to your hosting provider
4. Ensure the hosting provider supports static site hosting with routing

## F) Common Issues and Solutions

### Database Connection Issues:
- Verify PostgreSQL is running
- Check database credentials in `application.properties`
- Ensure the `church_ssl` database exists

### CORS Issues:
- Verify the allowed origins in `CorsConfig.java`
- Ensure the frontend is using the correct API URL

### API Endpoint Issues:
- Check the ngrok URL is still active (free tunnels expire)
- Verify the Spring Boot application is running
- Check server logs for error messages