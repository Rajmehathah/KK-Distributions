const fs = require('fs');
const path = require('path');

const publicJsonPath = path.join(__dirname, '../public/products/bansuri/products.json');
const dummyDataPath = path.join(__dirname, '../src/data/dummyData.ts');

const publicJson = JSON.parse(fs.readFileSync(publicJsonPath, 'utf8'));

console.log(`Public products.json has ${publicJson.length} entries.`);

// List unique categories in public json
const publicCategories = {};
publicJson.forEach(p => {
  publicCategories[p.category] = (publicCategories[p.category] || 0) + 1;
  // Check if image file exists
  if (p.image) {
    const imgFile = path.join(__dirname, '../public', p.image);
    if (!fs.existsSync(imgFile)) {
      console.log(`MISSING IMAGE FILE: ${p.image} for product ${p.name}`);
    }
  }
});

console.log('Public JSON Categories:', publicCategories);

// Check dummyData.ts images
const dummyContent = fs.readFileSync(dummyDataPath, 'utf8');
const dummyProducts = [];
const dummyRegex = /{\s*id:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?image:\s*'([^']+)'/g;

let match;
while ((match = dummyRegex.exec(dummyContent)) !== null) {
  dummyProducts.push({
    id: match[1],
    name: match[2],
    category: match[3],
    image: match[4]
  });
}

console.log(`Found ${dummyProducts.length} products in dummyData.ts.`);

const nonUrlImages = dummyProducts.filter(p => !p.image.startsWith('/') && !p.image.startsWith('http'));
console.log(`Products with non-URL image in dummyData.ts: ${nonUrlImages.length}`);
nonUrlImages.forEach(p => console.log(`  - [${p.category}] ${p.id} (${p.name}): ${p.image}`));
