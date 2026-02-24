#!/usr/bin/env node
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compressImage(inputPath, outputPath, quality = 80, resize = null) {
  try {
    let transform = sharp(inputPath);
    
    if (resize) {
      transform = transform.resize(resize.width, resize.height, {
        fit: 'cover',
        position: 'center'
      });
    }
    
    await transform
      .png({ quality, progressive: true, compressionLevel: 9 })
      .toFile(outputPath);
    
    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;
    const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(outputPath)}`);
    console.log(`  Before: ${(inputSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  After:  ${(outputSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Reduction: ${reduction}%\n`);
  } catch (err) {
    console.error(`✗ Error compressing ${inputPath}:`, err.message);
  }
}

async function main() {
  console.log('🖼️  Compressing images for optimal loading...\n');
  
  // Compress logo - use temp file then replace
  const logoTemp = '/workspaces/ramadanbot/public/logo-temp.png';
  await compressImage(
    '/workspaces/ramadanbot/public/logo.png',
    logoTemp,
    85,
    { width: 1200, height: 1152 }
  );
  fs.renameSync(logoTemp, '/workspaces/ramadanbot/public/logo.png');
  
  // Compress background - use temp file then replace
  const bgTemp = '/workspaces/ramadanbot/public/ramadan-background-temp.png';
  await compressImage(
    '/workspaces/ramadanbot/public/ramadan-background.png',
    bgTemp,
    80,
    { width: 1200, height: 1200 }
  );
  fs.renameSync(bgTemp, '/workspaces/ramadanbot/public/ramadan-background.png');

  // If a new background was uploaded as final.png, compress it and replace the ramadan background
  const finalBgPath = '/workspaces/ramadanbot/public/final.png';
  if (fs.existsSync(finalBgPath)) {
    const finalBgTemp = '/workspaces/ramadanbot/public/ramadan-background-final-temp.png';
    await compressImage(
      finalBgPath,
      finalBgTemp,
      80,
      { width: 1200, height: 1200 }
    );
    fs.renameSync(finalBgTemp, '/workspaces/ramadanbot/public/ramadan-background.png');

    // Also create a 1080x1080 export for flyer previews
    const final1080Path = '/workspaces/ramadanbot/public/final-1080.png';
    await compressImage(
      finalBgPath,
      final1080Path,
      85,
      { width: 1080, height: 1080 }
    );
  }

  // Also check for new.png (legacy backup)
  const newBgPath = '/workspaces/ramadanbot/public/new.png';
  if (fs.existsSync(newBgPath) && !fs.existsSync(finalBgPath)) {
    const newBgTemp = '/workspaces/ramadanbot/public/ramadan-background-new-temp.png';
    await compressImage(
      newBgPath,
      newBgTemp,
      80,
      { width: 1200, height: 1200 }
    );
    fs.renameSync(newBgTemp, '/workspaces/ramadanbot/public/ramadan-background.png');

    // Also create a 1080x1080 export for flyer previews
    const new1080Path = '/workspaces/ramadanbot/public/new-1080.png';
    await compressImage(
      newBgPath,
      new1080Path,
      85,
      { width: 1080, height: 1080 }
    );
  }
  
  // Compress WhatsApp icon
  const waTemp = '/workspaces/ramadanbot/public/whatsapp-temp.png';
  await compressImage(
    '/workspaces/ramadanbot/public/whatsapp.png',
    waTemp,
    90,
    { width: 256, height: 256 }
  );
  fs.renameSync(waTemp, '/workspaces/ramadanbot/public/whatsapp.png');
  
  // Compress Snapchat icon
  const snapTemp = '/workspaces/ramadanbot/public/snap-temp.png';
  await compressImage(
    '/workspaces/ramadanbot/public/snap.png',
    snapTemp,
    90,
    { width: 256, height: 256 }
  );
  fs.renameSync(snapTemp, '/workspaces/ramadanbot/public/snap.png');
  
  console.log('✓ All images compressed successfully!');
  console.log('Images should now load much faster.');
}

main().catch(console.error);
