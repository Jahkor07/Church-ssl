const { Client } = require('pg');

async function testPostgresConnection() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'church_ssl',
    password: 'password',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('Successfully connected to PostgreSQL!');
    
    const res = await client.query('SELECT NOW()');
    console.log('Current time from database:', res.rows[0].now);
    
    await client.end();
  } catch (err) {
    console.error('Connection error:', err.stack);
  }
}

testPostgresConnection();