import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  productId?: string;
  category?: string;
  src?: string; // Original CSS class or gradient
  alt: string;
  className?: string;
}

// Curated high-resolution, premium spiritual incense and packaging Unsplash assets matching the Bansuri catalogue
const PRODUCT_IMAGES: Record<string, string> = {
  // Category 1: Packet Series
  'bansuri-packet-classic-19': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', // sandalwood incense burning
  'bansuri-packet-classic-120': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  'bansuri-packet-vibe-120': 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80', // vibrant spiritual smoke
  'bansuri-packet-pineapple-42': 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&w=600&q=80', // pineapple sweet flame
  'bansuri-packet-mogra-19': 'https://images.unsplash.com/photo-1602989423168-52fb97992987?auto=format&fit=crop&w=600&q=80', // jasmine mogra ambient
  'bansuri-packet-lavender-120': 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=600&q=80', // calm lavender field
  'bansuri-packet-chandan-19': 'https://images.unsplash.com/photo-1508500383182-6c18550db061?auto=format&fit=crop&w=600&q=80', // sandalwood logs
  'bansuri-packet-rose-120': 'https://images.unsplash.com/photo-1602989423168-52fb97992987?auto=format&fit=crop&w=600&q=80', // floral rose burner

  // Category 2: Special Series
  'bansuri-special-beats-45': 'https://images.unsplash.com/photo-1612182062633-9ff3b3598eeb?auto=format&fit=crop&w=600&q=80', // beats golden aura
  'bansuri-special-beats-100': 'https://images.unsplash.com/photo-1612182062633-9ff3b3598eeb?auto=format&fit=crop&w=600&q=80',
  'bansuri-special-melody-100': 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&w=600&q=80', // melody smoke
  'bansuri-special-natya-45': 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80', // spiritual dance natya
  'bansuri-special-kissa-100': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', // story kissa lore

  // Category 3: Pouch Series
  'bansuri-pouch-classic': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  'bansuri-pouch-chandan': 'https://images.unsplash.com/photo-1508500383182-6c18550db061?auto=format&fit=crop&w=600&q=80',
  'bansuri-pouch-mogra': 'https://images.unsplash.com/photo-1602989423168-52fb97992987?auto=format&fit=crop&w=600&q=80',
  'bansuri-pouch-pineapple': 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&w=600&q=80',

  // Category 4: Wet Dhoop
  'bansuri-wet-classic': 'https://images.unsplash.com/photo-1609137144813-2d2c161947b1?auto=format&fit=crop&w=600&q=80', // cones on bronze plate
  'bansuri-wet-chandan': 'https://images.unsplash.com/photo-1609137144813-2d2c161947b1?auto=format&fit=crop&w=600&q=80',
  'bansuri-wet-rose': 'https://images.unsplash.com/photo-1609137144813-2d2c161947b1?auto=format&fit=crop&w=600&q=80',

  // Category 5: Premium Wet Dhoop
  'bansuri-premium-wet-classic': 'https://images.unsplash.com/photo-1609137144813-2d2c161947b1?auto=format&fit=crop&w=600&q=80', // dhoop cups and cones
  'bansuri-premium-wet-rose': 'https://images.unsplash.com/photo-1609137144813-2d2c161947b1?auto=format&fit=crop&w=600&q=80',
  'bansuri-premium-wet-guggal': 'https://images.unsplash.com/photo-1609137144813-2d2c161947b1?auto=format&fit=crop&w=600&q=80',

  // Category 6: Solid Dhoop
  'bansuri-solid-guggal': 'https://images.unsplash.com/photo-1602989423168-52fb97992987?auto=format&fit=crop&w=600&q=80',
  'bansuri-solid-chandan': 'https://images.unsplash.com/photo-1602989423168-52fb97992987?auto=format&fit=crop&w=600&q=80',

  // Category 7: Sambrani Series
  'bansuri-sambrani-cup-12': 'https://images.unsplash.com/photo-1609137144813-2d2c161947b1?auto=format&fit=crop&w=600&q=80', // sambrani cup burning
  'bansuri-sambrani-cones-10': 'https://images.unsplash.com/photo-1602989423168-52fb97992987?auto=format&fit=crop&w=600&q=80',

  // Category 8: Premium Series
  'vasu-agarbathi-60': 'https://images.unsplash.com/photo-1612182062633-9ff3b3598eeb?auto=format&fit=crop&w=600&q=80',
  'vasu-agarbathi-108': 'https://images.unsplash.com/photo-1612182062633-9ff3b3598eeb?auto=format&fit=crop&w=600&q=80',
  'bansuri-hexa-classic': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
};

const CATEGORY_FALLBACKS: Record<string, string> = {
  'bansuri-packet': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  'bansuri-special': 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80',
  'bansuri-pouch': 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&w=600&q=80',
  'wet-dhoop': 'https://images.unsplash.com/photo-1609137144813-2d2c161947b1?auto=format&fit=crop&w=600&q=80',
  'premium-wet-dhoop': 'https://images.unsplash.com/photo-1609137144813-2d2c161947b1?auto=format&fit=crop&w=600&q=80',
  'solid-dhoop': 'https://images.unsplash.com/photo-1602989423168-52fb97992987?auto=format&fit=crop&w=600&q=80',
  'sambrani-series': 'https://images.unsplash.com/photo-1609137144813-2d2c161947b1?auto=format&fit=crop&w=600&q=80',
  'premium-agarbathi-series': 'https://images.unsplash.com/photo-1612182062633-9ff3b3598eeb?auto=format&fit=crop&w=600&q=80'
};

const DUMMY_DEFAULT = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'; // Sandalwood incense default

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
    <div className={`relative overflow-hidden w-full h-full bg-brand-cream-200 dark:bg-brand-charcoal-800 transition-colors duration-300 ${className}`}>
      
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
        className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />

      {/* BRAND CARD OVERLAY WATERMARK */}
      {isLoaded && isIncenseCategory && (
        <div className="absolute inset-0 bg-gradient-to-t from-brand-sandalwood-900/40 via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default OptimizedImage;
