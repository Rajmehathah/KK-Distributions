import React, { useState, useEffect, useRef } from 'react';
import { Flame } from 'lucide-react';

interface OptimizedImageProps {
  productId?: string;
  category?: string;
  src?: string;
  alt: string;
  className?: string;
}

// Extracted local asset mapping
const LOCAL_PRODUCT_IMAGES: Record<string, string> = {
  // Sambrani Series
  'bansuri-sambrani-cup-12': '/assets/images/products/sambrani/sambrani-special-cup.webp',
  'bansuri-sambrani-cones-10': '/assets/images/products/sambrani/sambrani-cones.webp',
  'bansuri-sambrani-sticks-10': '/assets/images/products/sambrani/sambrani-sticks.webp',
  'bansuri-sambrani-rose-10': '/assets/images/products/sambrani/sambrani-rose-cones.webp',
  'bansuri-sambrani-chandan-10': '/assets/images/products/sambrani/sambrani-chandan-cones.webp',

  // Packet Series (Regular)
  'packet-classic': '/images/products/packet-series/classic.jpeg',
  'bansuri-packet-classic-19': '/images/products/packet-series/classic.jpeg',
  'bansuri-packet-classic-120': '/images/products/packet-series/classic.jpeg',
  
  'packet-vibe': '/images/products/packet-series/vibe.jpeg',
  'bansuri-packet-vibe-120': '/images/products/packet-series/vibe.jpeg',

  'packet-pineapple': '/images/products/packet-series/pineapple.webp',
  'bansuri-packet-pineapple-42': '/images/products/packet-series/pineapple.webp',

  'packet-mogra': '/images/products/packet-series/mogra.jpg',
  'bansuri-packet-mogra-19': '/images/products/packet-series/mogra.jpg',

  'packet-lavender': '/images/products/packet-series/lavender.jpeg',
  'bansuri-packet-lavender-120': '/images/products/packet-series/lavender.jpeg',

  'packet-chandan': '/images/products/packet-series/chandan.jpg',
  'bansuri-packet-chandan-19': '/images/products/packet-series/chandan.jpg',

  'packet-champa': '/images/products/packet-series/champa.jpg',
  'bansuri-packet-champa': '/images/products/packet-series/champa.jpg',

  'packet-rose': '/images/products/packet-series/rose.jpeg',
  'bansuri-packet-rose-19': '/images/products/packet-series/rose.jpeg',

  // Premium & Special Series
  'bansuri-premium-packet-royal': '/assets/images/products/premium-packet-series/premium-packet-royal.webp',
  'bansuri-special-beats-45': '/assets/images/products/special-series/special-beats-45.webp',
  'bansuri-pouch-classic': '/assets/images/products/pouch-series/pouch-classic.webp',
  'bansuri-wet-classic': '/assets/images/products/wet-dhoop/wet-dhoop-classic.webp',
  'bansuri-solid-guggal': '/assets/images/products/solid-dhoop/solid-dhoop-guggal.webp',
  'vasu-agarbathi-60': '/assets/images/products/vasu/vasu-60.webp',
  'bansuri-hexa-classic': '/assets/images/products/hexa/hexa-classic.webp'
};

const DEFAULT_FALLBACK_IMAGE = '/images/products/packet-series/classic.jpeg';

const getResolvedUrl = (productId?: string, src?: string): string => {
  if (src && (src.startsWith('http') || src.startsWith('/'))) {
    return src;
  }
  if (productId && LOCAL_PRODUCT_IMAGES[productId]) {
    return LOCAL_PRODUCT_IMAGES[productId];
  }
  return DEFAULT_FALLBACK_IMAGE;
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  productId,
  category: _category,
  src,
  alt,
  className = ''
}) => {
  const initialUrl = getResolvedUrl(productId, src);
  const [imgUrl, setImgUrl] = useState<string>(initialUrl);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const res = getResolvedUrl(productId, src);
    if (res !== imgUrl) {
      setImgUrl(res);
      setHasError(false);
    }
  }, [productId, src]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [imgUrl]);

  const handleError = () => {
    if (imgUrl !== DEFAULT_FALLBACK_IMAGE) {
      setImgUrl(DEFAULT_FALLBACK_IMAGE);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-brand-orange-950/20 via-brand-gold-900/10 to-brand-orange-900/30 border border-brand-orange-500/20 rounded-2xl flex flex-col items-center justify-center p-4 text-center ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 text-brand-cream-100 flex items-center justify-center shadow-md mb-2.5">
          <Flame className="w-6 h-6 animate-pulse" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange-900 dark:text-brand-gold-900 mb-0.5">
          BANSURI FMCG
        </span>
        <span className="text-[11px] font-extrabold text-brand-charcoal-800 dark:text-brand-cream-100 line-clamp-1 uppercase tracking-tight">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-brand-cream-100 dark:bg-brand-charcoal-800 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-orange-500/10 to-transparent animate-shimmer" />
      )}
      <img
        ref={imgRef}
        src={imgUrl}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-90'
        }`}
      />
    </div>
  );
};

export default OptimizedImage;
