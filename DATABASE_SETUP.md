# Database Setup Guide

This guide will help you set up the PostgreSQL database for the Church SSL application.

## Prerequisites

1. Docker Desktop (recommended) OR PostgreSQL installed locally
2. Node.js and npm

## Option 1: Using Docker (Recommended)

### 1. Start Docker Desktop
Make sure Docker Desktop is running on your system.

### 2. Start the PostgreSQL Container
Run the following command in your project directory:

```bash
docker-compose up -d
```

This will start a PostgreSQL database container with the following configuration:
- Port: 5432
- Database name: church_ssl
- Username: postgres
- Password: password

### 3. Initialize the Database Schema
After the container is running, initialize the database schema:

```bash
npm run db:push
```

### 4. Seed the Database (Optional)
To populate the database with sample data:

```bash
npm run db:seed
```

## Option 2: Using Local PostgreSQL Installation

### 1. Install PostgreSQL
Download and install PostgreSQL from https://www.postgresql.org/download/

### 2. Create Database
Create a new database named `church_ssl` using pgAdmin or the command line:

```sql
CREATE DATABASE church_ssl;
```

### 3. Update Environment Variables
Update the `.env` file with your local PostgreSQL credentials:

```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/church_ssl?schema=public"
```

### 4. Initialize the Database Schema
Run the database initialization:

```bash
npm run db:push
```

## Troubleshooting

### Connection Issues
If you're still experiencing connection issues:

1. Verify PostgreSQL is running:
   ```bash
   # On Windows
   netstat -an | findstr 5432
   
   # On macOS/Linux
   netstat -an | grep 5432
   ```

2. Check Docker container status:
   ```bash
   docker-compose ps
   ```

3. Restart the Docker container:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Permission Errors
If you encounter permission errors:

1. Make sure you're running commands in the project directory
2. Ensure Docker Desktop is running with appropriate permissions
3. On Windows, try running your terminal as Administrator

### Prisma Client Issues
If you encounter Prisma client issues:

1. Regenerate the Prisma client:
   ```bash
   npm run db:generate
   ```

2. Clear the Prisma cache:
   ```bash
   npx prisma generate --watch
   ```

## Verifying the Connection

To verify the database connection is working:

1. Run the test script:
   ```bash
   node test-db-connection.js
   ```

2. You should see output similar to:
   ```
   Connected to database successfully!
   Found X lessons in the database
   ```

## Need Help?

If you continue to experience issues:

1. Check the Docker logs:
   ```bash
   docker-compose logs
   ```

2. Verify your environment variables in `.env` file

3. Ensure no other applications are using port 5432

4. Contact support with the error message you're receiving