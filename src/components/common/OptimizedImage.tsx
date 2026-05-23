import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  productId?: string;
  category?: string;
  src?: string; // Original CSS class or gradient
  alt: string;
  className?: string;
}

// Highly curated high-resolution eCommerce Unsplash mappings matching FMCG category lines
const PRODUCT_IMAGES: Record<string, string> = {
  // Agarbathis
  'agarbathi-1': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', // sandalwood incense
  'agarbathi-2': 'https://images.unsplash.com/photo-1602989423168-52fb97992987?auto=format&fit=crop&w=600&q=80', // rose fragrance
  'agarbathi-3': 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&w=600&q=80', // jasmine flora
  'agarbathi-4': 'https://images.unsplash.com/photo-1609137144813-2d2c161947b1?auto=format&fit=crop&w=600&q=80', // temple Gold
  'agarbathi-5': 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=600&q=80', // lavender
  'agarbathi-6': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', // royal musk
  'agarbathi-7': 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80', // camphor sacred
  
  // Biscuits
  'biscuit-1': 'https://images.unsplash.com/photo-1558961309-dbdf71799f14?auto=format&fit=crop&w=600&q=80', // butter cookies
  'biscuit-2': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80', // choco cookies
  'biscuit-3': 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80', // milk biscuits
  'biscuit-4': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', // coconut bites
  'biscuit-5': 'https://images.unsplash.com/photo-1590083473918-c7ae77686014?auto=format&fit=crop&w=600&q=80', // cardamom tea
  'biscuit-6': 'https://images.unsplash.com/photo-1530601273649-16327e57c6df?auto=format&fit=crop&w=600&q=80', // digestive
  'biscuit-7': 'https://images.unsplash.com/photo-1532499016263-f2c3e89df9cd?auto=format&fit=crop&w=600&q=80', // cashew cookies
  
  // Mixtures
  'snack-1': 'https://images.unsplash.com/photo-1601050690597-df056fb49785?auto=format&fit=crop&w=600&q=80', // spicy madras mixture
  'snack-2': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', // corn flakes
  'snack-3': 'https://images.unsplash.com/photo-1601050690696-9799a7f34c26?auto=format&fit=crop&w=600&q=80', // garlic sev
  'snack-4': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80', // masala peanuts
  'snack-5': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80', // potato chips
  'snack-6': 'https://images.unsplash.com/photo-1601050691497-20c57f910b8d?auto=format&fit=crop&w=600&q=80', // murukku
  'snack-7': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80', // ribbon pakoda
  
  // Beverages
  'beverage-1': 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=600&q=80', // mango juice
  'beverage-2': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80', // lemon mint soda
  'beverage-3': 'https://images.unsplash.com/photo-1625772291427-f6524d9898c5?auto=format&fit=crop&w=600&q=80', // cola can
  'beverage-4': 'https://images.unsplash.com/photo-1622543953490-0b70d38a8a68?auto=format&fit=crop&w=600&q=80', // energy active
  'beverage-5': 'https://images.unsplash.com/photo-1527960656306-ff37c414729a?auto=format&fit=crop&w=600&q=80', // tender coconut
  'beverage-6': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80', // orange juice
  'beverage-7': 'https://images.unsplash.com/photo-1608885898957-a599fb1b1a44?auto=format&fit=crop&w=600&q=80', // mineral water
  
  // Household Essentials
  'household-1': 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80', // lemon dish wash
  'household-2': 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80', // floor cleaner citrus
  'household-3': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80', // washing powder
  'household-4': 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80', // aloe handwash
  'household-5': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80', // toilet cleaner
  'household-6': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80', // kitchen rolls
  'household-7': 'https://images.unsplash.com/photo-1611288875054-c7a382d33585?auto=format&fit=crop&w=600&q=80', // garbage bags
  
  // Grocery
  'grocery-1': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', // basmati rice bag
  'grocery-2': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', // unpolished dal
  'grocery-3': 'https://images.unsplash.com/photo-1581608597305-3797b08c4801?auto=format&fit=crop&w=600&q=80', // sulphur sugar
  'grocery-4': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', // wheat flour bag
  'grocery-5': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', // wood-press groundnut oil
  'grocery-6': 'https://images.unsplash.com/photo-1604882737321-e6937fd6f519?auto=format&fit=crop&w=600&q=80', // pure salt pack
  'grocery-7': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' // golden turmeric
};

const CATEGORY_FALLBACKS: Record<string, string> = {
  'dhoop-agarbathi': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  'biscuits': 'https://images.unsplash.com/photo-1558961309-dbdf71799f14?auto=format&fit=crop&w=600&q=80',
  'mixtures-snacks': 'https://images.unsplash.com/photo-1601050690597-df056fb49785?auto=format&fit=crop&w=600&q=80',
  'beverages': 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=600&q=80',
  'household-essentials': 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
  'daily-grocery': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
};

const DUMMY_DEFAULT = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'; // generic grocery shelf

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
      {isLoaded && category === 'dhoop-agarbathi' && (
        <div className="absolute inset-0 bg-gradient-to-t from-brand-sandalwood-900/40 via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default OptimizedImage;
