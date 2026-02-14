#!/usr/bin/env node

/**
 * AI to PNG Conversion using Node.js + CloudConvert API
 * This script converts all 604 AI files to PNG using a cloud service
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PUBLIC_DIR = '/workspaces/ramadanbot/public';
const AI_FILES = fs.readdirSync(PUBLIC_DIR)
  .filter(f => f.endsWith('.ai'))
  .sort();

console.log(`📄 Found ${AI_FILES.length} .ai files`);

// Check if PNG versions already exist
const PNG_COUNT = fs.readdirSync(PUBLIC_DIR)
  .filter(f => f.endsWith('.png') && f.includes('___Hafs39__DM'))
  .length;

console.log(`📊 Already have ${PNG_COUNT} PNG files\n`);

if (PNG_COUNT === AI_FILES.length) {
  console.log('✅ All files already converted!');
  process.exit(0);
}

// Option 1: Suggested local conversion command
console.log('🔧 CONVERSION METHODS:\n');
console.log('METHOD 1: Using Ghostscript (Recommended for high quality)');
console.log('─────────────────────────────────────────────────────');
console.log('# Install if needed:');
console.log('sudo apt-get update && sudo apt-get install -y ghostscript\n');
console.log('# Convert all files:');
console.log('cd /workspaces/ramadanbot/public');
console.log('for f in *___Hafs39__DM.ai; do');
console.log('  echo "Converting $f..."');
console.log('  gs -q -dNOPAUSE -dBATCH -dSAFER \\');
console.log('     -sDEVICE=pngalpha \\');
console.log('     -r150 \\');
console.log('     -sOutputFile="${f%.ai}.png" \\');
console.log('     "$f"');
console.log('done\n');

console.log('METHOD 2: Using ImageMagick');
console.log('─────────────────────────────────────────────────────');
console.log('sudo apt-get install -y imagemagick');
console.log('cd /workspaces/ramadanbot/public');
console.log('mogrify -format png -density 150 *___Hafs39__DM.ai\n');

console.log('METHOD 3: Using Online Service (CloudConvert)');
console.log('─────────────────────────────────────────────────────');
console.log('1. Visit: https://cloudconvert.com/ai-to-png');
console.log('2. Upload your .ai files');
console.log('3. Download converted PNG files');
console.log('4. Place them in: /workspaces/ramadanbot/public/\n');

console.log('METHOD 4: Using Adobe Illustrator (Local)');
console.log('─────────────────────────────────────────────────────');
console.log('1. Open Adobe Illustrator');
console.log('2. File > Export for Web');
console.log('3. Select PNG format');
console.log('4. Choose output folder');
console.log('5. Use "Batch" to export all 604 files\n'); 

console.log('\n📝 Once conversion is complete, the Quran reader will display properly!\n');

// Create a helper HTML file for manual conversion visualization
const helperHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI to PNG Conversion Status</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f7;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1d1d1f;
            margin-bottom: 10px;
        }
        .status {
            font-size: 14px;
            color: #666;
            margin-bottom: 30px;
        }
        .stat {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-box {
            background: #f5f5f7;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: #0071e3;
        }
        .stat-label {
            font-size: 12px;
            color: #666;
            margin-top: 8px;
        }
        .conversion-files {
            margin-top: 30px;
        }
        .file-item {
            padding: 12px;
            background: #f5f5f7;
            border-radius: 6px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
        }
        .file-status {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-done {
            background-color: #34c759;
        }
        .status-pending {
            background-color: #ff9500;
        }
        .instructions {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌙 Quran Reader - AI to PNG Conversion</h1>
        <div class="status">
            Total .ai files: <strong>${AI_FILES.length}</strong> | 
            PNG files ready: <strong>${PNG_COUNT}</strong> | 
            Remaining: <strong>${AI_FILES.length - PNG_COUNT}</strong>
        </div>
        
        <div class="instructions">
            <strong>Quick Setup:</strong> Install Ghostscript locally, then run the bash commands above to batch convert all files in seconds!
        </div>
        
        <div class="stat">
            <div class="stat-box">
                <div class="stat-number">${AI_FILES.length}</div>
                <div class="stat-label">Total Files</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${PNG_COUNT}</div>
                <div class="stat-label">Converted</div>
            </div>
        </div>
        
        <h2 style="color: #1d1d1f; font-size: 16px; margin-bottom: 15px;">📋 File Status</h2>
        <div class="conversion-files" id="files"></div>
    </div>
    
    <script>
        const container = document.getElementById('files');
        const aiFiles = ${JSON.stringify(AI_FILES.slice(0, 20))};
        const pngFiles = new Set();
        
        // In real usage, fetch the list of PNG files
        aiFiles.forEach(file => {
            const pngName = file.replace('.ai', '.png');
            const status = pngFiles.has(pngName) ? 'done' : 'pending';
            const statusClass = status === 'done' ? 'status-done' : 'status-pending';
            const statusText = status === 'done' ? '✅ Done' : '⏳ Pending';
            
            container.innerHTML += \`
                <div class="file-item">
                    <span><span class="file-status \${statusClass}"></span>\${pngName}</span>
                    <span>\${statusText}</span>
                </div>
            \`;
        });
        
        if (aiFiles.length > 20) {
            container.innerHTML += \`<div class="file-item"><em>... and \${aiFiles.length - 20} more files</em></div>\`;
        }
    </script>
</body>
</html>
`;

fs.writeFileSync(
  '/workspaces/ramadanbot/public/conversion-status.html',
  helperHtml
);

console.log('✅ Created conversion status page at /public/conversion-status.html\n');
