import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  productId?: string;
  category?: string;
  src?: string; // Original CSS class or gradient
  alt: string;
  className?: string;
}

// Curriculum-intelligent mapping linking product catalog IDs directly to exact extracted PDF packaging images
const PRODUCT_IMAGES: Record<string, string> = {
  // Category 1: Packet Series (Pages 2-3)
  'bansuri-packet-classic-19': '/products/bansuri/page_3_img_5_84.png',
  'bansuri-packet-classic-120': '/products/bansuri/page_3_img_5_84.png',
  'bansuri-packet-vibe-120': '/products/bansuri/page_3_img_7_86.png',
  'bansuri-packet-pineapple-42': '/products/bansuri/page_1_img_3_19.png',
  'bansuri-packet-mogra-19': '/products/bansuri/page_3_img_7_86.png',
  'bansuri-packet-lavender-120': '/products/bansuri/page_3_img_5_84.png',
  'bansuri-packet-chandan-19': '/products/bansuri/page_3_img_7_86.png',
  'bansuri-packet-rose-120': '/products/bansuri/page_3_img_5_84.png',

  // Category 2: Special Series (Page 4)
  'bansuri-special-beats-45': '/products/bansuri/page_8_img_3_255.png',
  'bansuri-special-beats-100': '/products/bansuri/page_8_img_3_255.png',
  'bansuri-special-melody-100': '/products/bansuri/page_8_img_5_257.png',
  'bansuri-special-natya-45': '/products/bansuri/page_8_img_7_259.png',
  'bansuri-special-kissa-100': '/products/bansuri/page_8_img_9_261.png',

  // Category 3: Pouch Series (Pages 5-8)
  'bansuri-pouch-classic': '/products/bansuri/page_8_img_3_255.png',
  'bansuri-pouch-chandan': '/products/bansuri/page_8_img_5_257.png',
  'bansuri-pouch-mogra': '/products/bansuri/page_8_img_7_259.png',
  'bansuri-pouch-pineapple': '/products/bansuri/page_8_img_9_261.png',

  // Category 4: Wet Dhoop (Page 9)
  'bansuri-wet-classic': '/products/bansuri/page_9_img_3_282.png',
  'bansuri-wet-chandan': '/products/bansuri/page_9_img_5_284.png',
  'bansuri-wet-rose': '/products/bansuri/page_9_img_7_286.png',

  // Category 5: Premium Wet Dhoop (Page 10)
  'bansuri-premium-wet-classic': '/products/bansuri/page_10_img_3_309.png',
  'bansuri-premium-wet-rose': '/products/bansuri/page_10_img_5_311.png',
  'bansuri-premium-wet-guggal': '/products/bansuri/page_10_img_7_313.png',

  // Category 6: Solid Dhoop (Page 11)
  'bansuri-solid-guggal': '/products/bansuri/page_11_img_3_338.png',
  'bansuri-solid-chandan': '/products/bansuri/page_11_img_5_340.png',

  // Category 7: Sambrani Series (Page 12)
  'bansuri-sambrani-cup-12': '/products/bansuri/page_12_img_3_365.png',
  'bansuri-sambrani-cones-10': '/products/bansuri/page_12_img_5_367.png',

  // Category 8: Premium Series (Page 13)
  'vasu-agarbathi-60': '/products/bansuri/page_13_img_1_382.jpeg',
  'vasu-agarbathi-108': '/products/bansuri/page_13_img_1_382.jpeg',
  'bansuri-hexa-classic': '/products/bansuri/page_12_img_7_369.png'
};

const CATEGORY_FALLBACKS: Record<string, string> = {
  'bansuri-packet': '/products/bansuri/page_3_img_5_84.png',
  'bansuri-special': '/products/bansuri/page_8_img_3_255.png',
  'bansuri-pouch': '/products/bansuri/page_8_img_3_255.png',
  'wet-dhoop': '/products/bansuri/page_9_img_3_282.png',
  'premium-wet-dhoop': '/products/bansuri/page_10_img_3_309.png',
  'solid-dhoop': '/products/bansuri/page_11_img_3_338.png',
  'sambrani-series': '/products/bansuri/page_12_img_3_365.png',
  'premium-agarbathi-series': '/products/bansuri/page_13_img_1_382.jpeg'
};

const DUMMY_DEFAULT = '/products/bansuri/page_3_img_5_84.png'; // sandalum package default fallback

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  productId,
  category,
  src,
  alt,
  className = ''
}) => {
  const [imgUrl, setImgUrl] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    // Resolve URL based on direct ID mapping, then Category fallback, then absolute default
    let resolvedUrl = DUMMY_DEFAULT;
    if (src && src.startsWith('http')) {
      resolvedUrl = src;
    } else if (productId && PRODUCT_IMAGES[productId]) {
      resolvedUrl = PRODUCT_IMAGES[productId];
    } else if (category && CATEGORY_FALLBACKS[category]) {
      resolvedUrl = CATEGORY_FALLBACKS[category];
    }
    setImgUrl(resolvedUrl);
  }, [productId, category, src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    // Fall back to category or generic
    if (category && CATEGORY_FALLBACKS[category] && imgUrl !== CATEGORY_FALLBACKS[category]) {
      setImgUrl(CATEGORY_FALLBACKS[category]);
    } else {
      setImgUrl(DUMMY_DEFAULT);
    }
  };

  const isIncenseCategory = 
    category?.startsWith('bansuri') || 
    category?.includes('dhoop') || 
    category?.includes('sambrani') || 
    category?.includes('agarbathi');

  return (
    <div className={`relative overflow-hidden w-full h-full bg-brand-cream-100 dark:bg-brand-charcoal-800 transition-colors duration-300 ${className}`}>
      
      {/* SHIMMER PLACEHOLDER COMPONENT */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 animate-shimmer bg-[length:200%_100%]" />
      )}

      {/* RENDER DYNAMIC IMAGE */}
      <img
        src={imgUrl}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-contain p-2 transition-transform duration-500 hover:scale-105 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />

      {/* BRAND CARD OVERLAY WATERMARK */}
      {isLoaded && isIncenseCategory && (
        <div className="absolute inset-0 bg-gradient-to-t from-brand-sandalwood-900/10 via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default OptimizedImage;
