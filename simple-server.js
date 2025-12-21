const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 3005;

app.get('/test-db', async (req, res) => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'church_ssl',
    password: 'password',
    port: 5432,
  });

  try {
    console.log('Attempting to connect to database...');
    await client.connect();
    console.log('Successfully connected to the database!');
    
    const result = await client.query('SELECT NOW() as now');
    res.json({ 
      status: 'success', 
      message: 'Connected successfully!', 
      currentTime: result.rows[0].now 
    });
    
    await client.end();
  } catch (err) {
    console.error('Database connection error:', err.message);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed', 
      error: err.message,
      code: err.code
    });
    
    try {
      await client.end();
    } catch (e) {}
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log(`Visit http://localhost:${port}/test-db to test database connection`);
});