const { exec } = require('child_process');

console.log('Checking database connection...');

// Check if Docker is running
exec('docker info', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Docker is not running or not installed');
    console.log('Please start Docker Desktop and try again');
    return;
  }
  
  console.log('✅ Docker is running');
  
  // Check if PostgreSQL container is running
  exec('docker-compose ps', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Error checking Docker containers');
      return;
    }
    
    if (stdout.includes('postgres') && stdout.includes('Up')) {
      console.log('✅ PostgreSQL container is running');
      
      // Test database connection
      exec('node test-db-connection.js', (error, stdout, stderr) => {
        if (error) {
          console.log('❌ Database connection failed');
          console.log('Error:', stderr);
          return;
        }
        
        console.log('✅ Database connection successful');
        console.log(stdout);
      });
    } else {
      console.log('⚠️  PostgreSQL container is not running');
      console.log('Try running: docker-compose up -d');
    }
  });
});