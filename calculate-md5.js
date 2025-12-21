const crypto = require('crypto');

const password = 'password';
const username = 'postgres';
const hash = crypto.createHash('md5').update(password + username).digest('hex');
console.log('Calculated MD5 hash:', hash);

const postgresHash = '32e12f215ba27cb750c9e093ce4b5127';
console.log('PostgreSQL stored hash:', postgresHash);

console.log('Match:', hash === postgresHash);