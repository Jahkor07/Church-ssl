# Church SSL - Complete Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://church_user:church_password@localhost:5432/church_db?schema=public"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Clerk Authentication (Get these from https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/admin/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/admin/dashboard"
```

### 2. Database Setup

Start PostgreSQL with Docker:
```bash
docker-compose up -d
```

Generate Prisma client and push schema:
```bash
npm run db:generate
npm run db:push
```

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) - you'll be redirected to the admin dashboard.

## 🔐 Clerk Authentication Setup

1. Go to [https://clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your publishable key and secret key to the `.env` file
4. Configure your application settings:
   - Set sign-in URL: `/sign-in`
   - Set sign-up URL: `/sign-up`
   - Set after sign-in URL: `/admin/dashboard`
   - Set after sign-up URL: `/admin/dashboard`

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/                 # Protected admin routes
│   │   ├── dashboard/         # Main dashboard
│   │   ├── lessons/           # Lesson management
│   │   │   ├── new/           # Create new lesson
│   │   │   └── [id]/edit/     # Edit lesson
│   │   └── languages/         # Language management
│   ├── api/                   # API routes
│   │   ├── languages/         # Language endpoints
│   │   └── lessons/           # Lesson endpoints
│   ├── sign-in/               # Clerk sign-in page
│   ├── sign-up/               # Clerk sign-up page
│   └── profile/               # User profile page
├── components/
│   └── LessonForm.tsx         # Reusable lesson form
└── lib/
    └── prisma.ts              # Prisma client
```

## 🗄️ Database Models

### Admin
- User management for administrators
- Fields: id, email, name, password, role, timestamps

### Lesson
- Educational content with language support
- Fields: id, title, description, introduction, content, year, languageId, isPublished, order, timestamps

### Language
- Supported languages for lessons
- Fields: id, name, code, flag, isActive, timestamps

## 🔌 API Endpoints

### Languages
- `GET /api/languages` - Get all active languages

### Lessons
- `GET /api/lessons` - Get lesson summaries (with optional year/lang filters)
- `POST /api/lessons` - Create new lesson
- `GET /api/lessons/years` - Get distinct lesson years
- `GET /api/lessons/[id]` - Get full lesson details
- `PUT /api/lessons/[id]` - Update lesson
- `DELETE /api/lessons/[id]` - Delete lesson

## 🎨 Features Implemented

### ✅ Authentication & Authorization
- Clerk integration with protected routes
- Middleware protection for `/admin/*` routes
- Sign-in, sign-up, and profile pages

### ✅ Admin Dashboard
- Sidebar navigation layout
- Dashboard with statistics and quick actions
- Responsive design with Tailwind CSS

### ✅ Lesson Management
- Full CRUD operations for lessons
- Rich text editor (Tiptap) for content
- Form validation with react-hook-form and Zod
- Filter by year and language
- Publish/unpublish functionality
- Delete confirmation modal

### ✅ Language Management
- View and manage supported languages
- Toggle active/inactive status
- Multi-language lesson support

### ✅ Rich Text Editing
- Tiptap editor for introduction and content fields
- Toolbar with bold, italic, and list formatting
- Placeholder text for better UX

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with sample data
```

## 🐳 Docker

The project includes Docker Compose for PostgreSQL:
- Database: PostgreSQL 15
- Port: 5432
- Database: church_db
- User: church_user
- Password: church_password

## 🔧 Troubleshooting

### Common Issues

1. **Clerk Authentication Not Working**
   - Verify your Clerk keys in `.env`
   - Check that your Clerk application URLs match the environment variables

2. **Database Connection Issues**
   - Ensure Docker is running
   - Check that PostgreSQL container is up: `docker-compose ps`
   - Verify DATABASE_URL in `.env`

3. **Rich Text Editor Not Loading**
   - Check browser console for errors
   - Ensure all Tiptap dependencies are installed

4. **Form Validation Errors**
   - Check that all required fields are filled
   - Verify data types match the schema

### Getting Help

- Check the browser console for client-side errors
- Check the terminal for server-side errors
- Verify all environment variables are set correctly
- Ensure all dependencies are installed: `npm install`

## 🚀 Deployment

### Environment Variables for Production
Make sure to set all environment variables in your production environment, especially:
- `DATABASE_URL` - Your production database connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key
- `NEXTAUTH_URL` - Your production domain

### Database Migration
Before deploying, run:
```bash
npm run db:push
```

This will create the necessary tables in your production database.


