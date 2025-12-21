# Church SSL Backend API

This is the backend API for the Church SSL system built with Spring Boot.

## Project Structure

```
src/main/java/com/churchssl/
├── ChurchSslApplication.java          # Main application class
├── api/
│   ├── controller/                    # REST controllers
│   │   ├── LanguageController.java
│   │   └── LessonController.java
│   ├── service/                       # Business logic
│   │   ├── LanguageService.java
│   │   └── LessonService.java
│   ├── repository/                    # Data access layers
│   │   ├── LanguageRepository.java
│   │   ├── LessonRepository.java
│   │   └── SectionRepository.java
│   ├── entity/                        # JPA entities
│   │   ├── Language.java
│   │   ├── Lesson.java
│   │   └── Section.java
│   ├── dto/                           # Data transfer objects
│   │   ├── LanguageDto.java
│   │   ├── LessonDto.java
│   │   ├── LessonRequestDto.java
│   │   ├── SectionDto.java
│   │   └── SectionRequestDto.java
│   ├── config/                        # Configuration classes
│   │   └── CorsConfig.java
│   └── exception/                     # Custom exceptions
└── resources/
    └── application.properties         # Application configuration
```

## API Endpoints

### Languages
- `GET /api/languages` - Get all active languages
- `GET /api/languages/{id}` - Get language by ID
- `POST /api/languages` - Create a new language
- `PUT /api/languages/{id}` - Update a language
- `DELETE /api/languages/{id}` - Delete a language

### Lessons
- `GET /api/lessons/by-quarter?year={year}&quarter={quarter}` - Get lessons by year and quarter
- `GET /api/lessons/years` - Get all distinct years
- `GET /api/lessons` - Get lessons with filters
- `GET /api/lessons/{id}` - Get lesson by ID
- `POST /api/lessons` - Create a new lesson
- `PUT /api/lessons/{id}` - Update a lesson
- `DELETE /api/lessons/{id}` - Delete a lesson

## Setup Instructions

1. Make sure you have Java 17+ and Maven installed
2. Set up a PostgreSQL database named `church_ssl`
3. Update the database configuration in `src/main/resources/application.properties`
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```
5. The API will be available at `http://localhost:9000`

## Building for Production

```bash
mvn clean package
java -jar target/church-ssl-backend-0.0.1-SNAPSHOT.jar
```