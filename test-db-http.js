const http = require('http');
const { Client } = require('pg');

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  
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
    console.log('Connected successfully!');
    
    const result = await client.query('SELECT NOW() as now');
    res.end(`Connected successfully! Current time: ${result.rows[0].now}`);
    
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err);
    res.end(`Connection failed: ${err.message}\nCode: ${err.code}`);
    
    try {
      await client.end();
    } catch (e) {}
  }
});

server.listen(3005, () => {
  console.log('Server running at http://localhost:3005/');
  console.log('Visit http://localhost:3005/ to test database connection');
});