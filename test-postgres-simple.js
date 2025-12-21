const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: 'postgresql://postgres:password@localhost:5432/church_ssl'
  });

  try {
    await client.connect();
    console.log('Connected successfully!');
    
    const res = await client.query('SELECT version()');
    console.log('PostgreSQL version:', res.rows[0].version);
    
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

testConnection();