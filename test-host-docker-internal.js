const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    user: 'postgres',
    host: 'host.docker.internal',
    database: 'church_ssl',
    password: 'password',
    port: 5432,
  });

  try {
    console.log('Attempting to connect to database using host.docker.internal...');
    await client.connect();
    console.log('Successfully connected to the database!');
    
    const res = await client.query('SELECT NOW()');
    console.log('Current time from database:', res.rows[0].now);
    
    await client.end();
  } catch (err) {
    console.error('Database connection error:', err.message);
    console.error('Error code:', err.code);
    process.exit(1);
  }
}

testConnection();