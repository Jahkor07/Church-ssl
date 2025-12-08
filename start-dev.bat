@echo off
echo Church SSL Development Environment Setup
echo ======================================

echo.
echo 1. Starting PostgreSQL database...
docker-compose up -d

echo.
echo 2. Waiting for database to start...
timeout /t 10 /nobreak >nul

echo.
echo 3. Generating Prisma client...
npm run db:generate

echo.
echo 4. Pushing database schema...
npm run db:push

echo.
echo 5. Starting development server...
npm run dev

echo.
echo Setup complete! The application should now be running at http://localhost:3000
pause