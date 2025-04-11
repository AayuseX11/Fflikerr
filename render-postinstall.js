// Script to set up Render environment for Puppeteer
// This runs after npm install but before the app starts

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running post-install script for Render environment...');

// Check if we're running on Render
const isRender = process.env.RENDER === 'true';

if (isRender) {
  console.log('Detected Render environment');
  
  // Create a file to log the Chrome path
  try {
    // Check common locations for Chrome/Chromium
    const possiblePaths = [
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/opt/render/project/chrome-linux/chrome'
    ];
    
    const chromePaths = possiblePaths.map(p => {
      try {
        fs.accessSync(p);
        return `${p} - EXISTS`;
      } catch (e) {
        return `${p} - NOT FOUND`;
      }
    });
    
    // Write the results to a file
    fs.writeFileSync(
      path.join(__dirname, 'chrome-paths.log'),
      chromePaths.join('\n')
    );
    
    console.log('Chrome paths logged to chrome-paths.log');
    
    // Try to install Chrome if it's not found
    if (!chromePaths.some(p => p.includes('EXISTS'))) {
      console.log('No Chrome installation found. Attempting to install...');
      try {
        execSync('apt-get update && apt-get install -y chromium-browser', { stdio: 'inherit' });
        console.log('Chromium installed successfully');
      } catch (installError) {
        console.error('Failed to install Chromium:', installError.message);
      }
    }
  } catch (error) {
    console.error('Error in post-install script:', error);
  }
}

console.log('Post-install script completed');
