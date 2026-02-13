#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');

async function optimizeQuranPages() {
  console.log('🔍 Scanning Quran pages...');
  
  const manifest = {
    totalPages: 604,
    totalSize: 0,
    pages: {},
    generatedAt: new Date().toISOString(),
    status: 'processing',
  };

  let processedCount = 0;
  let totalSize = 0;
  const errors = [];

  for (let page = 1; page <= 604; page++) {
    const paddedPage = String(page).padStart(3, '0');
    const fileName = `${paddedPage}___Hafs39__DM.ai`;
    const filePath = path.join(publicDir, fileName);

    try {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        totalSize += stats.size;

        manifest.pages[paddedPage] = {
          page,
          fileName,
          size: stats.size,
          created: stats.birthtime.toISOString(),
          url: `/${fileName}`,
          valid: true,
        };

        processedCount++;

        if (page % 100 === 0) {
          console.log(`  ✓ Processed ${page} pages...`);
        }
      } else {
        errors.push(`Missing: ${fileName}`);
      }
    } catch (error) {
      errors.push(`Error reading ${fileName}: ${error.message}`);
    }
  }

  manifest.totalSize = totalSize;
  manifest.status = 'complete';

  const manifestPath = path.join(publicDir, 'quran-pages-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('\n✅ Optimization Complete!\n');
  console.log('📊 Summary:');
  console.log(`  • Total Pages: ${processedCount}/604`);
  console.log(`  • Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  • Avg File Size: ${(totalSize / processedCount / 1024).toFixed(0)} KB`);
  console.log(`  • Manifest: public/quran-pages-manifest.json\n`);
}

optimizeQuranPages().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
