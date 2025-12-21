const { PrismaClient } = require('@prisma/client');

// Test with the exact same URL from .env
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:password@localhost:5432/church_ssl?schema=public&connect_timeout=30'
    }
  }
});

async function testConnection() {
  try {
    console.log('Attempting to connect with Prisma...');
    await prisma.$connect();
    console.log('Successfully connected with Prisma!');
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('Query result:', result);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Prisma connection error:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    
    await prisma.$disconnect().catch(() => {});
  }
}

testConnection();