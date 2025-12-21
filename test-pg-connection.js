const { Client } = require('pg');

async function testPgConnection() {
  // Try different connection methods
  const configs = [
    {
      name: 'Direct localhost connection',
      config: {
        user: 'postgres',
        host: 'localhost',
        database: 'church_ssl',
        password: 'password',
        port: 5432,
      }
    },
    {
      name: 'Direct 127.0.0.1 connection',
      config: {
        user: 'postgres',
        host: '127.0.0.1',
        database: 'church_ssl',
        password: 'password',
        port: 5432,
      }
    },
    {
      name: 'Connection with SSL disabled',
      config: {
        user: 'postgres',
        host: 'localhost',
        database: 'church_ssl',
        password: 'password',
        port: 5432,
        ssl: false
      }
    },
    {
      name: 'Connection with different timeout',
      config: {
        user: 'postgres',
        host: 'localhost',
        database: 'church_ssl',
        password: 'password',
        port: 5432,
        connectionTimeoutMillis: 5000
      }
    },
    {
      name: 'Connection to container IP',
      config: {
        user: 'postgres',
        host: '172.18.0.2',
        database: 'church_ssl',
        password: 'password',
        port: 5432,
      }
    }
  ];

  for (const { name, config } of configs) {
    console.log(`\n--- Testing ${name} ---`);
    const client = new Client(config);

    try {
      console.log('Attempting to connect...');
      await client.connect();
      console.log('Successfully connected!');
      
      const res = await client.query('SELECT NOW() as now');
      console.log('Current time:', res.rows[0].now);
      
      await client.end();
      return; // Exit if any connection succeeds
    } catch (err) {
      console.error('Connection failed:');
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      
      try {
        await client.end();
      } catch (e) {}
    }
  }
  
  console.log('\nAll connection methods failed.');
}

testPgConnection();