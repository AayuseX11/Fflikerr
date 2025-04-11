// Script to set up Render environment for Puppeteer
// This runs after npm install but before the app starts

const fs = require('fs');
const path = require('path');

console.log('Running post-install script for Render environment...');

// Check if we're running on Render
const isRender = process.env.RENDER === 'true';

if (isRender) {
  console.log('Detected Render environment');
  
  // Check common locations for Chrome/Chromium
  const possiblePaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/opt/render/project/.apt/usr/bin/chromium-browser',
    '/opt/render/project/.apt/usr/bin/chromium',
    '/opt/render/project/chrome-linux/chrome'
  ];
  
  // Log all possible Chrome paths
  console.log('Checking for Chrome installations:');
  const chromePaths = possiblePaths.map(p => {
    try {
      fs.accessSync(p);
      return `${p} - EXISTS`;
    } catch (e) {
      return `${p} - NOT FOUND`;
    }
  });
  
  console.log(chromePaths.join('\n'));
  
  // Write the results to a file
  try {
    fs.writeFileSync(
      path.join(__dirname, 'chrome-paths.log'),
      chromePaths.join('\n')
    );
    console.log('Chrome paths logged to chrome-paths.log');
  } catch (error) {
    console.log('Could not write to chrome-paths.log (read-only filesystem)', error.message);
  }
  
  // Note: We cannot install Chrome on Render's free tier due to read-only filesystem
  console.log('Note: On Render free tier, we rely on pre-installed Chromium');
}

console.log('Post-install script completed');
