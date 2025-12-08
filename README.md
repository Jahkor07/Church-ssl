# Church SSL - Next.js 14 Project

A modern Next.js 14 application with App Router, Tailwind CSS, Prisma ORM, and PostgreSQL database.

## Features

- ⚡ Next.js 14 with App Router
- 🎨 Tailwind CSS for styling
- 🗄️ Prisma ORM with PostgreSQL
- 🐳 Docker Compose for database
- 📁 Organized folder structure

## Project Structure

```
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Reusable React components
│   └── lib/           # Utility functions and configurations
├── prisma/            # Database schema and migrations
├── docker-compose.yml # PostgreSQL database setup
└── package.json       # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose (recommended)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/church_ssl?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Start the PostgreSQL database:**
   ```bash
   docker-compose up -d
   ```

4. **Generate Prisma client:**
   ```bash
   npm run db:generate
   ```

5. **Push database schema:**
   ```bash
   npm run db:push
   ```

6. **Seed database with sample data (optional):**
   ```bash
   npm run db:seed
   ```

7. **Start the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Connection Issues

If you encounter database connection issues, please refer to the detailed [Database Setup Guide](DATABASE_SETUP.md) for troubleshooting steps.

Common issues and solutions:

1. **Docker not running**: Ensure Docker Desktop is running before starting the database
2. **Port conflicts**: Make sure no other application is using port 5432
3. **Permission issues**: Try running Docker as administrator on Windows

## Database Models

- **Admin**: User management for administrators
- **Lesson**: Educational content with language support
- **Language**: Supported languages for lessons

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## Database Management

The project uses PostgreSQL with Prisma ORM. The database runs in a Docker container for easy setup and development.

To reset the database:
```bash
docker-compose down -v
docker-compose up -d
npm run db:push
```