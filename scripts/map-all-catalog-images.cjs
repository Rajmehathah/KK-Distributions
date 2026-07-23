const fs = require('fs');
const path = require('path');

const publicJsonPath = path.join(__dirname, '../public/products/bansuri/products.json');
const dummyDataPath = path.join(__dirname, '../src/data/dummyData.ts');

const publicJson = JSON.parse(fs.readFileSync(publicJsonPath, 'utf8'));

// Build lookup map by product id or normalized name
const imageLookup = {};
publicJson.forEach(p => {
  if (p.image) {
    imageLookup[p.id] = p.image;
  }
});

// Category default fallback images from public/products/bansuri/
const categoryFallbacks = {
  'packet-series': '/images/products/packet-series/classic.jpeg',
  'premium-packet-series': '/products/bansuri/page_3_img_5_84.png',
  'special-series': '/products/bansuri/page_8_img_3_255.png',
  'pouch-series': '/products/bansuri/page_6_img_3_192.png',
  'special-pouch-series': '/products/bansuri/page_8_img_5_257.png',
  'premium-pouch-series': '/products/bansuri/page_6_img_1_180.jpeg',
  'premium-special-pouch-series': '/products/bansuri/page_8_img_7_259.png',
  'wet-dhoop': '/products/bansuri/page_10_img_3_309.png',
  'premium-wet-dhoop': '/products/bansuri/page_10_img_1_297.jpeg',
  'solid-dhoop': '/products/bansuri/page_12_img_3_365.png',
  'sambrani': '/products/bansuri/page_13_img_1_382.jpeg',
  'vasu-series': '/products/bansuri/page_14_img_1_411.jpeg',
  'hexa-series': '/products/bansuri/page_9_img_3_282.png',
};

// Map specific dummyData product IDs to best available public images
const explicitProductImageMap = {
  // Premium Packet Series
  'prem-packet-classic': '/products/bansuri/page_3_img_5_84.png',
  'prem-packet-lavender': '/products/bansuri/page_3_img_5_84.png',
  'prem-packet-my3': '/products/bansuri/page_3_img_2_298.jpeg',

  // Special Series
  'special-beats': '/products/bansuri/page_8_img_3_255.png',
  'special-melody': '/products/bansuri/page_8_img_5_257.png',
  'special-natya': '/products/bansuri/page_8_img_7_259.png',
  'special-kisna': '/products/bansuri/page_8_img_1_243.jpeg',

  // Pouch Series
  'pouch-classic': '/products/bansuri/page_6_img_3_192.png',
  'pouch-vibe': '/products/bansuri/page_6_img_5_194.png',
  'pouch-pineapple': '/products/bansuri/page_6_img_7_196.png',
  'pouch-mogra': '/products/bansuri/page_6_img_9_198.png',
  'pouch-lavender': '/products/bansuri/page_6_img_3_192.png',
  'pouch-chandan': '/products/bansuri/page_6_img_1_180.jpeg',
  'pouch-champa': '/products/bansuri/page_6_img_5_194.png',
  'pouch-rose': '/products/bansuri/page_6_img_7_196.png',

  // Special Pouch Series
  'spec-pouch-beats': '/products/bansuri/page_8_img_3_255.png',
  'spec-pouch-melody': '/products/bansuri/page_8_img_5_257.png',
  'spec-pouch-natya': '/products/bansuri/page_8_img_7_259.png',
  'spec-pouch-kisna': '/products/bansuri/page_8_img_1_243.jpeg',

  // Premium Pouch Series
  'prem-pouch-classic': '/products/bansuri/page_6_img_1_180.jpeg',
  'prem-pouch-vibe': '/products/bansuri/page_6_img_3_192.png',
  'prem-pouch-pineapple': '/products/bansuri/page_6_img_5_194.png',
  'prem-pouch-mogra': '/products/bansuri/page_6_img_7_196.png',
  'prem-pouch-lavender': '/products/bansuri/page_6_img_9_198.png',
  'prem-pouch-chandan': '/products/bansuri/page_6_img_1_180.jpeg',
  'prem-pouch-champa': '/products/bansuri/page_6_img_3_192.png',
  'prem-pouch-rose': '/products/bansuri/page_6_img_5_194.png',
  'prem-pouch-flavorz': '/products/bansuri/page_6_img_7_196.png',

  // Premium Special Pouch Series
  'prem-spec-pouch-beats': '/products/bansuri/page_8_img_3_255.png',
  'prem-spec-pouch-melody': '/products/bansuri/page_8_img_5_257.png',
  'prem-spec-pouch-natya': '/products/bansuri/page_8_img_7_259.png',
  'prem-spec-pouch-kisna': '/products/bansuri/page_8_img_1_243.jpeg',

  // Wet Dhoop
  'wet-dhoop-classic': '/products/bansuri/page_10_img_3_309.png',
  'wet-dhoop-mogra': '/products/bansuri/page_10_img_5_311.png',
  'wet-dhoop-chandan': '/products/bansuri/page_10_img_7_313.png',
  'wet-dhoop-rose': '/products/bansuri/page_10_img_9_315.png',

  // Premium Wet Dhoop
  'prem-wet-dhoop-classic': '/products/bansuri/page_10_img_1_297.jpeg',
  'prem-wet-dhoop-rose': '/products/bansuri/page_10_img_4_308.jpeg',
  'prem-wet-dhoop-chandan': '/products/bansuri/page_10_img_6_310.jpeg',
  'prem-wet-dhoop-mogra': '/products/bansuri/page_10_img_8_312.jpeg',
  'prem-wet-dhoop-guggal': '/products/bansuri/page_10_img_10_314.jpeg',

  // Solid Dhoop
  'solid-dhoop-guggal': '/products/bansuri/page_12_img_3_365.png',
  'solid-dhoop-chandan': '/products/bansuri/page_12_img_5_367.png',
  'solid-dhoop-rose': '/products/bansuri/page_12_img_7_369.png',
  'solid-dhoop-loban': '/products/bansuri/page_12_img_9_371.png',

  // Sambrani
  'sambrani-cup': '/products/bansuri/page_13_img_1_382.jpeg',
  'sambrani-cones': '/products/bansuri/page_13_img_3_392.jpeg',
  'sambrani-natural': '/products/bansuri/page_13_img_9_399.jpeg',
  'sambrani-rose-cones': '/products/bansuri/page_13_img_3_392.jpeg',
  'sambrani-chandan-cones': '/products/bansuri/page_13_img_9_399.jpeg',

  // Vasu Series
  'vasu-agarbathi-60': '/products/bansuri/page_14_img_1_411.jpeg',
  'vasu-agarbathi-108': '/products/bansuri/page_14_img_2_412.jpeg',
  'vasu-long-stick': '/products/bansuri/page_14_img_1_411.jpeg',

  // Hexa Series
  'hexa-classic': '/products/bansuri/page_9_img_3_282.png',
  'hexa-melody': '/products/bansuri/page_9_img_5_284.png',
  'hexa-chandan': '/products/bansuri/page_9_img_7_286.png',
  'hexa-beats': '/products/bansuri/page_9_img_9_288.png',
};

// Read dummyData.ts and update all non-URL images
let dummyContent = fs.readFileSync(dummyDataPath, 'utf8');

Object.keys(explicitProductImageMap).forEach(productId => {
  const imgUrl = explicitProductImageMap[productId];
  const regex = new RegExp(`(id:\\s*'${productId}'[\\s\\S]*?image:\\s*')([^']+)(')`, 'g');
  dummyContent = dummyContent.replace(regex, `$1${imgUrl}$3`);
});

fs.writeFileSync(dummyDataPath, dummyContent, 'utf8');
console.log('Successfully updated dummyData.ts with image paths for all products!');
