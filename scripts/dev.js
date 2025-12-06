const { spawn } = require('child_process');
const open = require('open');

// Start the Next.js development server
const nextProcess = spawn('next', ['dev', '--turbopack'], {
  stdio: 'inherit',
  shell: true
});

// Open the browser after a short delay to ensure the server has started
setTimeout(() => {
  open('http://localhost:3000');
}, 3000);

// Handle process exit
nextProcess.on('close', (code) => {
  process.exit(code);
});