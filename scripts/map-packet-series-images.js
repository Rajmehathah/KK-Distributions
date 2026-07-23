const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../AGARBATHI (PACKET)');
const TARGET_DIR = path.join(__dirname, '../public/images/products/packet-series');

const PRODUCTS_TO_MATCH = [
  { key: 'classic', name: 'Classic', id: 'packet-classic', tsId: 'bansuri-packet-classic-19' },
  { key: 'vibe', name: 'Vibe', id: 'packet-vibe', tsId: 'bansuri-packet-vibe-120' },
  { key: 'pineapple', name: 'Pineapple', id: 'packet-pineapple', tsId: 'bansuri-packet-pineapple-42' },
  { key: 'mogra', name: 'Mogra', id: 'packet-mogra', tsId: 'bansuri-packet-mogra-19' },
  { key: 'lavender', name: 'Lavender', id: 'packet-lavender', tsId: 'bansuri-packet-lavender-120' },
  { key: 'chandan', name: 'Chandan', id: 'packet-chandan', tsId: 'bansuri-packet-chandan-19' },
  { key: 'champa', name: 'Champa', id: 'packet-champa', tsId: 'bansuri-packet-champa' },
  { key: 'rose', name: 'Rose', id: 'packet-rose', tsId: 'bansuri-packet-rose-19' },
];

function normalizeFilename(filename) {
  const parsed = path.parse(filename);
  let name = parsed.name.toLowerCase();
  
  // Ignore noise words
  const wordsToIgnore = ['bansuri', 'packet', 'agarbathi', 'agarbatti', 'incense', 'series'];
  wordsToIgnore.forEach(word => {
    name = name.replace(new RegExp(word, 'g'), '');
  });

  // Ignore spaces, underscores, hyphens
  name = name.replace(/[\s\-_]/g, '').trim();
  return { normalized: name, ext: parsed.ext, raw: filename };
}

function run() {
  console.log('====================================================');
  console.log('STEP 1 & 2: SCANNING AND MATCHING FILENAMES');
  console.log('====================================================');
  console.log('Source Folder:', SOURCE_DIR);

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error('ERROR: Source directory does not exist:', SOURCE_DIR);
    process.exit(1);
  }

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const files = fs.readdirSync(SOURCE_DIR);
  console.log(`Found ${files.length} total file(s) in source directory.`);

  const matched = {};
  const matchedFiles = new Set();

  files.forEach(file => {
    // Only check image files
    if (!/\.(jpg|jpeg|png|webp|svg)$/i.test(file)) return;

    const { normalized, ext } = normalizeFilename(file);
    console.log(`Analyzing: "${file}" -> Normalized: "${normalized}"`);

    PRODUCTS_TO_MATCH.forEach(product => {
      if (normalized === product.key || normalized.includes(product.key)) {
        if (!matched[product.key]) {
          matched[product.key] = {
            rawFile: file,
            ext,
            targetPath: `/images/products/packet-series/${product.key}${ext}`
          };
          matchedFiles.add(file);
        }
      }
    });
  });

  // STEP 5 REPORTING
  console.log('\n====================================================');
  console.log('STEP 5: MATCH RESULTS REPORT');
  console.log('====================================================');

  const unmatchedImages = files.filter(f => /\.(jpg|jpeg|png|webp|svg)$/i.test(f) && !matchedFiles.has(f));
  const missingProducts = PRODUCTS_TO_MATCH.filter(p => !matched[p.key]);

  if (unmatchedImages.length > 0) {
    console.log('\nUnmatched Images:');
    unmatchedImages.forEach(img => console.log(`  - ${img}`));
  } else {
    console.log('\nUnmatched Images: None');
  }

  if (missingProducts.length > 0) {
    console.log('\nMissing Products:');
    missingProducts.forEach(p => console.log(`  - ${p.name}`));
  } else {
    console.log('\nMissing Products: None');
  }

  console.log('\nMatched Mappings:');
  Object.keys(matched).forEach(key => {
    console.log(`  ✓ ${key.toUpperCase()} -> ${matched[key].rawFile} (Serving as ${matched[key].targetPath})`);
  });

  // STEP 3 & 4: COPY FILES AND UPDATE CODE
  console.log('\n====================================================');
  console.log('STEP 3 & 4: COPYING ASSETS AND UPDATING DATA SOURCES');
  console.log('====================================================');

  // Copy files
  Object.keys(matched).forEach(key => {
    const item = matched[key];
    const srcFile = path.join(SOURCE_DIR, item.rawFile);
    const destFile = path.join(TARGET_DIR, `${key}${item.ext}`);
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${item.rawFile} -> ${destFile}`);
  });

  // Update dummyData.ts
  const dummyDataPath = path.join(__dirname, '../src/data/dummyData.ts');
  let dummyDataContent = fs.readFileSync(dummyDataPath, 'utf8');

  PRODUCTS_TO_MATCH.forEach(p => {
    if (matched[p.key]) {
      const imgPath = matched[p.key].targetPath;
      // Replace image property for product with id packet-<key>
      const regex = new RegExp(`(id:\\s*'packet-${p.key}'[\\s\\S]*?image:\\s*')([^']+)(')`, 'g');
      dummyDataContent = dummyDataContent.replace(regex, `$1${imgPath}$3`);
    }
  });

  fs.writeFileSync(dummyDataPath, dummyDataContent, 'utf8');
  console.log('Updated src/data/dummyData.ts');

  // Update OptimizedImage.tsx
  const optImgPath = path.join(__dirname, '../src/components/common/OptimizedImage.tsx');
  let optImgContent = fs.readFileSync(optImgPath, 'utf8');

  PRODUCTS_TO_MATCH.forEach(p => {
    if (matched[p.key]) {
      const imgPath = matched[p.key].targetPath;
      // Replace packet-series entries in LOCAL_PRODUCT_IMAGES
      const regex = new RegExp(`('${p.id}':\\s*')([^']+)(')`, 'g');
      optImgContent = optImgContent.replace(regex, `$1${imgPath}$3`);

      const regexTs = new RegExp(`('${p.tsId}':\\s*')([^']+)(')`, 'g');
      optImgContent = optImgContent.replace(regexTs, `$1${imgPath}$3`);
    }
  });

  fs.writeFileSync(optImgPath, optImgContent, 'utf8');
  console.log('Updated src/components/common/OptimizedImage.tsx');

  console.log('\nAll Packet Series (Regular) image mappings completed successfully!');
}

run();
