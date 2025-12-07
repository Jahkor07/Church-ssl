const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test the connection
    await prisma.$connect();
    console.log('Connected to database successfully!');
    
    // Try a simple query
    const count = await prisma.lesson.count();
    console.log(`Found ${count} lessons in the database`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();