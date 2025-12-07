const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Cleaning development environment...');

try {
  // Clean Next.js cache
  const nextCache = path.join(__dirname, '..', '.next');
  if (fs.existsSync(nextCache)) {
    fs.rmSync(nextCache, { recursive: true, force: true });
    console.log('✓ Cleaned .next cache');
  }

  // Clean Node modules cache
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✓ Cleaned npm cache');

  // Clean TypeScript cache
  const tsBuildInfo = path.join(__dirname, '..', '.tsbuildinfo');
  if (fs.existsSync(tsBuildInfo)) {
    fs.rmSync(tsBuildInfo, { force: true });
    console.log('✓ Cleaned TypeScript build info');
  }

  console.log('\n✨ Development environment cleaned successfully!');
  console.log('You can now run "npm run dev" for a fresh start.');
} catch (error) {
  console.error('Error cleaning environment:', error.message);
  process.exit(1);
}