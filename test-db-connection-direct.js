const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'church_ssl',
  password: 'password',
  port: 5432,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Successfully connected to the database');
    
    const res = await client.query('SELECT NOW()');
    console.log('Current time from database:', res.rows[0].now);
    
    await client.end();
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
}

testConnection();