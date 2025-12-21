const { PrismaClient } = require('@prisma/client');

// Try different connection URLs
const connectionUrls = [
  'postgresql://postgres:password@localhost:5432/church_ssl?schema=public&connect_timeout=30',
  'postgresql://postgres:password@127.0.0.1:5432/church_ssl?schema=public&connect_timeout=30',
  'postgresql://postgres:password@host.docker.internal:5432/church_ssl?schema=public&connect_timeout=30'
];

async function testConnection(url, description) {
  console.log(`\n--- Testing ${description} ---`);
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    },
    log: ['query', 'info', 'warn', 'error']
  });

  try {
    console.log('Attempting to connect to database...');
    await prisma.$connect();
    console.log('Successfully connected to the database');
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('Query result:', result);
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('Database connection error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    await prisma.$disconnect().catch(() => {});
    return false;
  }
}

async function testAllConnections() {
  console.log('Testing different connection methods...');
  
  for (let i = 0; i < connectionUrls.length; i++) {
    const success = await testConnection(connectionUrls[i], `Connection method ${i + 1}`);
    if (success) {
      console.log(`SUCCESS with connection method ${i + 1}: ${connectionUrls[i]}`);
      return;
    }
  }
  
  console.log('\nAll connection methods failed.');
}

testAllConnections();