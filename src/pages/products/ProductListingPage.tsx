import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Flame,
  Crown,
  Package,
  Box,
  ShoppingBag,
  Award,
  Droplet,
  FlameKindling,
  Layers,
  Flower2,
  ShieldCheck,
  Hexagon,
  ArrowUp,
  Eye,
  X,
  ShoppingCart,
} from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../../data/dummyData';
import type { Product, ProductSizeOption } from '../../data/dummyData';
import { useCartStore } from '../../store/cartStore';
import { showToast } from '../../store/toastStore';
import OptimizedImage from '../../components/common/OptimizedImage';

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'packet-series': Flame,
  'premium-packet-series': Sparkles,
  'special-series': Crown,
  'pouch-series': Package,
  'special-pouch-series': Box,
  'premium-pouch-series': ShoppingBag,
  'premium-special-pouch-series': Award,
  'wet-dhoop': Droplet,
  'premium-wet-dhoop': FlameKindling,
  'solid-dhoop': Layers,
  'sambrani': Flower2,
  'vasu-series': ShieldCheck,
  'hexa-series': Hexagon,
};

export const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  
  // Track selected pack sizes per product: productId -> sizeIndex
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});

  const activeCategoryRef = useRef<string>('all');
  const isManualClickRef = useRef<boolean>(false);

  // Calculate combined height of main header (80px) + sticky category navbar
  const getStickyNavHeight = (): number => {
    const mainHeader = document.querySelector('header');
    const categoryHeader = document.getElementById('sticky-category-header');
    const headerH = mainHeader ? mainHeader.offsetHeight : 80;
    const catNavH = categoryHeader ? categoryHeader.offsetHeight : 65;
    return headerH + catNavH;
  };

  // 1. Center Pill in Horizontal Scroll Container
  const centerHorizontalPill = (catId: string) => {
    const pill = document.getElementById(`tab-pill-${catId}`);
    if (pill) {
      pill.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  // 2. Vertical Page Scroll with Exact Offset Below Sticky Header
  const scrollVerticalToCategory = (catId: string) => {
    if (catId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const section = document.getElementById(`category-${catId}`);
    if (section) {
      const stickyHeight = getStickyNavHeight();
      const rect = section.getBoundingClientRect();
      const absoluteTop = window.pageYOffset + rect.top;
      // Exact alignment: section title stops 16px below sticky navbar
      const targetY = Math.max(0, absoluteTop - stickyHeight - 16);

      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    }
  };

  // Sync category param from URL
  useEffect(() => {
    const cat = searchParams.get('category');
    const targetCat = cat || 'all';
    
    if (targetCat !== activeCategoryRef.current) {
      activeCategoryRef.current = targetCat;
      setSelectedCategory(targetCat);

      requestAnimationFrame(() => {
        centerHorizontalPill(targetCat);
        if (cat) {
          setTimeout(() => {
            scrollVerticalToCategory(cat);
          }, 100);
        }
      });
    }

    const pid = searchParams.get('id');
    if (pid) {
      const match = PRODUCTS.find((p) => p.id === pid);
      if (match) setPreviewProduct(match);
    }
  }, [searchParams]);

  // Scroll spy to update active category as user scrolls manually
  useEffect(() => {
    const handleScroll = () => {
      if (isManualClickRef.current) return;

      const stickyHeight = getStickyNavHeight();
      const scrollPosition = window.pageYOffset + stickyHeight + 80;

      for (let i = CATEGORIES.length - 1; i >= 0; i--) {
        const cat = CATEGORIES[i];
        const section = document.getElementById(`category-${cat.id}`);
        if (section) {
          const sectionTop = window.pageYOffset + section.getBoundingClientRect().top;
          if (scrollPosition >= sectionTop) {
            if (activeCategoryRef.current !== cat.id) {
              activeCategoryRef.current = cat.id;
              setSelectedCategory(cat.id);
              centerHorizontalPill(cat.id);
            }
            break;
          }
        }
      }

      if (window.pageYOffset < 150 && activeCategoryRef.current !== 'all') {
        activeCategoryRef.current = 'all';
        setSelectedCategory('all');
        centerHorizontalPill('all');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Category Switch Handler combining smooth transitions
  const handleCategorySwitch = (catId: string) => {
    isManualClickRef.current = true;
    activeCategoryRef.current = catId;

    if (catId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }

    setSelectedCategory(catId);

    // Auto-center horizontal pill
    requestAnimationFrame(() => {
      centerHorizontalPill(catId);
    });

    // Execute vertical page scroll alignment
    requestAnimationFrame(() => {
      scrollVerticalToCategory(catId);
    });

    // Release manual click lock after smooth scroll completes
    setTimeout(() => {
      isManualClickRef.current = false;
    }, 800);
  };

  const scrollToTop = () => {
    isManualClickRef.current = true;
    activeCategoryRef.current = 'all';
    setSelectedCategory('all');
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
    centerHorizontalPill('all');
    setTimeout(() => {
      isManualClickRef.current = false;
    }, 600);
  };

  const handleSizeSelect = (productId: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSizes((prev) => ({ ...prev, [productId]: index }));
  };

  const handleAddToCart = (product: Product, sizeOption?: ProductSizeOption, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    const sizeIdx = selectedSizes[product.id] || 0;
    const activeSize = sizeOption || (product.sizes && product.sizes[sizeIdx]) || {
      size: product.unit,
      mrp: product.price,
      b2bPrice: product.b2bPrice,
    };

    const cartProductItem: Product = {
      ...product,
      unit: activeSize.size,
      price: activeSize.mrp,
      b2bPrice: activeSize.b2bPrice || Math.round(activeSize.mrp * 0.75),
    };

    addItem(cartProductItem, 1);
    showToast(`Added ${product.name} (${activeSize.size}) to basket.`, 'success');
  };

  // Always display ALL categories sequentially continuously
  const categoriesToDisplay = CATEGORIES;

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-brand-charcoal-900 transition-colors duration-300 pb-20">
      
      {/* 1. PAGE HEADER */}
      <div className="bg-gradient-to-b from-brand-orange-950/10 to-transparent py-10 border-b border-brand-orange-100/10 dark:border-brand-gold-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange-900/10 dark:bg-brand-gold-900/10 text-brand-orange-900 dark:text-brand-gold-900 text-xs font-extrabold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BANSURI FMCG CATALOGUE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-tight">
                Our Products Showcase
              </h1>
              <p className="text-xs sm:text-sm text-brand-charcoal-600 dark:text-brand-cream-300 font-medium max-w-xl mt-1.5">
                Authentic Indian incense, wet & solid dhoop, sambrani cups and devotional series crafted with tradition.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal-400" />
              <input
                type="text"
                placeholder="Search products or fragrances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-brand-orange-900/20 dark:border-brand-gold-900/20 bg-white dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:ring-2 focus:ring-brand-orange-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-charcoal-400 hover:text-brand-charcoal-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. STICKY CATEGORY NAVIGATION BAR WITH SPRING SLIDING PILL */}
      <div
        id="sticky-category-header"
        className="sticky top-20 z-30 bg-white/95 dark:bg-brand-charcoal-900/95 backdrop-blur-md border-b border-brand-orange-100/10 dark:border-brand-gold-900/10 shadow-sm py-3.5 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="horizontal-category-nav"
            className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
          >
            {/* ALL CATEGORIES TAB BUTTON */}
            <motion.button
              id="tab-pill-all"
              onClick={() => handleCategorySwitch('all')}
              whileHover={{ y: -2, scale: 1.03 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 group flex-shrink-0"
            >
              {selectedCategory === 'all' && (
                <motion.div
                  layoutId="activeCategoryPill"
                  transition={{
                    type: 'spring',
                    stiffness: 110,
                    damping: 18,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 shadow-md shadow-brand-orange-900/20"
                />
              )}
              <span className={`relative z-10 flex items-center gap-2 ${selectedCategory === 'all' ? 'text-brand-cream-100' : 'text-brand-charcoal-700 dark:text-brand-cream-300'}`}>
                <span>All Categories</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] ${selectedCategory === 'all' ? 'bg-black/20 text-white' : 'bg-brand-orange-900/10 text-brand-orange-900 dark:bg-brand-gold-900/20 dark:text-brand-gold-900'}`}>
                  {PRODUCTS.length}
                </span>
              </span>
            </motion.button>

            {/* CATEGORY TAB BUTTONS */}
            {CATEGORIES.map((cat) => {
              const IconComp = categoryIconMap[cat.id] || Flame;
              const isSelected = selectedCategory === cat.id;

              return (
                <motion.button
                  key={cat.id}
                  id={`tab-pill-${cat.id}`}
                  onClick={() => handleCategorySwitch(cat.id)}
                  whileHover={{ y: -2, scale: 1.03 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 group flex-shrink-0"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      transition={{
                        type: 'spring',
                        stiffness: 110,
                        damping: 18,
                        mass: 0.8,
                      }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 shadow-md shadow-brand-orange-900/20"
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-2 ${isSelected ? 'text-brand-cream-100' : 'text-brand-charcoal-700 dark:text-brand-cream-300'}`}>
                    <motion.div
                      animate={isSelected ? { rotate: [0, 8, 0] } : { rotate: 0 }}
                      whileHover={{ rotate: 6 }}
                      transition={{ duration: 0.25 }}
                    >
                      <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-cream-100' : 'text-brand-orange-900 dark:text-brand-gold-900'}`} />
                    </motion.div>
                    <span>{cat.name}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] ${isSelected ? 'bg-black/20 text-white' : 'bg-brand-orange-900/10 text-brand-orange-900 dark:bg-brand-gold-900/20 dark:text-brand-gold-900'}`}>
                      {cat.productCount}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. GROUPED CATEGORY SECTIONS CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        {categoriesToDisplay.map((cat) => {
          const IconComp = categoryIconMap[cat.id] || Flame;
          
          // Filter products for this specific category
          const categoryProducts = PRODUCTS.filter((p) => {
            const matchesCat = p.category === cat.id;
            const matchesSearch = !searchQuery || 
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              (p.variantName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
              (p.categoryName || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
          });

          if (searchQuery && categoryProducts.length === 0) {
            return null; // Skip empty sections during active search
          }

          return (
            <section
              key={cat.id}
              id={`category-${cat.id}`}
              className="scroll-mt-36 space-y-6"
            >
              {/* CATEGORY SECTION HEADER */}
              <div className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/10 dark:border-brand-gold-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden">
                <div className="flex items-start sm:items-center gap-4">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 8, 0] }}
                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                    className="w-12 h-12 rounded-2xl bg-brand-orange-900/10 dark:bg-brand-gold-900/20 text-brand-orange-900 dark:text-brand-gold-900 flex items-center justify-center flex-shrink-0 shadow-sm"
                  >
                    <IconComp className="w-6 h-6" />
                  </motion.div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-tight">
                        {cat.name}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-orange-900/10 text-brand-orange-900 dark:bg-brand-gold-900/20 dark:text-brand-gold-900">
                        {categoryProducts.length} Products
                      </span>
                    </div>
                    <p className="text-xs text-brand-charcoal-600 dark:text-brand-cream-300 font-medium max-w-2xl">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={scrollToTop}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-cream-100 dark:bg-brand-charcoal-800 text-brand-charcoal-700 dark:text-brand-cream-300 text-xs font-bold hover:bg-brand-orange-900/10 transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Top</span>
                  </button>
                </div>
              </div>

              {/* PRODUCTS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.map((product, cardIndex) => {
                  const sizeIdx = selectedSizes[product.id] || 0;
                  const activeSize = (product.sizes && product.sizes[sizeIdx]) || {
                    size: product.unit,
                    mrp: product.price,
                    b2bPrice: product.b2bPrice,
                  };
                  const activeMRP = activeSize.mrp;
                  const activeB2B = activeSize.b2bPrice || Math.round(activeMRP * 0.75);

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: Math.min(cardIndex * 0.03, 0.2),
                        ease: 'easeOut',
                      }}
                      whileHover={{
                        y: -4,
                        scale: 1.01,
                        transition: { duration: 0.2, ease: 'easeOut' },
                      }}
                      onClick={() => setPreviewProduct(product)}
                      className="group bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/10 dark:border-brand-gold-900/10 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:shadow-brand-orange-900/15 hover:border-brand-orange-500/40 rounded-[24px] p-5 flex flex-col justify-between cursor-pointer relative overflow-hidden transition-colors duration-300"
                    >
                      <div>
                        {/* TOP BADGES */}
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                          {product.isBestseller && (
                            <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-brand-orange-900 text-brand-cream-100 tracking-wider shadow">
                              Bestseller
                            </span>
                          )}
                          {product.isNew && (
                            <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-brand-gold-900 text-brand-cream-100 tracking-wider shadow">
                              New Launch
                            </span>
                          )}
                        </div>

                        {/* PRODUCT IMAGE VISUAL WITH HOVER ZOOM */}
                        <div className="w-full h-44 rounded-2xl shadow-inner mb-4 relative overflow-hidden bg-brand-cream-100 dark:bg-brand-charcoal-800">
                          <OptimizedImage
                            productId={product.id}
                            category={product.category}
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full transform transition-transform duration-500 group-hover:scale-105"
                          />
                          
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <div className="w-10 h-10 rounded-full bg-white text-brand-charcoal-900 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                              <Eye className="w-5 h-5" />
                            </div>
                          </div>
                        </div>

                        {/* FRAGRANCE / CATEGORY BADGE */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-brand-orange-900/10 text-brand-orange-900 dark:bg-brand-gold-900/20 dark:text-brand-gold-900">
                            {product.variantName || 'Incense'}
                          </span>
                          <span className="text-[10px] text-brand-charcoal-400 dark:text-brand-cream-300 font-semibold uppercase">
                            GST {product.gstRate}%
                          </span>
                        </div>

                        {/* PRODUCT TITLE */}
                        <h3 className="text-sm font-black text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-tight line-clamp-1 group-hover:text-brand-orange-900 dark:group-hover:text-brand-gold-900 transition-colors">
                          {product.name}
                        </h3>

                        {/* PACK SIZE SELECTION PILLS */}
                        <div className="mt-3 space-y-1.5">
                          <label className="text-[10px] font-bold text-brand-charcoal-400 uppercase tracking-wider">
                            Available Pack Sizes:
                          </label>
                          <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {(product.sizes || []).map((s, sIdx) => {
                              const isSelected = sizeIdx === sIdx;
                              return (
                                <button
                                  key={sIdx}
                                  onClick={(e) => handleSizeSelect(product.id, sIdx, e)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                    isSelected
                                      ? 'bg-brand-orange-900 text-white dark:bg-brand-gold-900 dark:text-brand-charcoal-900 shadow-sm'
                                      : 'bg-brand-cream-100 dark:bg-brand-charcoal-800 text-brand-charcoal-700 dark:text-brand-cream-300 hover:bg-brand-orange-900/10'
                                  }`}
                                >
                                  {s.size}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* CARD FOOTER: PRICING & ADD ACTION */}
                      <div className="mt-4 pt-3 border-t border-brand-orange-100/10 dark:border-brand-gold-900/10 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[10px] font-bold text-brand-charcoal-400 uppercase">
                            Retail MRP
                          </div>
                          <div className="text-lg font-black text-brand-charcoal-900 dark:text-brand-cream-50">
                            ₹{activeMRP}
                          </div>
                          <div className="text-[10px] font-extrabold text-brand-orange-900 dark:text-brand-gold-900">
                            B2B: ₹{activeB2B}
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleAddToCart(product, activeSize, e)}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 text-brand-cream-100 font-extrabold text-xs uppercase tracking-wider shadow-md shadow-brand-orange-900/20 hover:brightness-110 transition-all flex items-center gap-1.5 flex-shrink-0"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* BOTTOM BACK TO TOP LEAP LINK */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={scrollToTop}
                  className="flex items-center gap-1 text-[11px] font-extrabold text-brand-orange-900 dark:text-brand-gold-900 uppercase tracking-wider hover:underline"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to Top</span>
                </button>
              </div>

            </section>
          );
        })}
      </div>

      {/* 4. PRODUCT DETAIL PREVIEW MODAL */}
      <AnimatePresence>
        {previewProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewProduct(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] bottom-[10%] sm:inset-y-auto sm:top-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:w-full sm:left-1/2 sm:-translate-x-1/2 z-50 bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/20 dark:border-brand-gold-900/20 shadow-2xl rounded-[28px] p-6 sm:p-8 flex flex-col sm:grid sm:grid-cols-2 gap-6 items-start overflow-y-auto max-h-[85vh] transition-colors"
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setPreviewProduct(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-brand-cream-100 dark:bg-brand-charcoal-800 text-brand-charcoal-700 dark:text-brand-cream-300 hover:bg-brand-orange-900/10 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* IMAGE PREVIEW */}
              <div className="w-full aspect-square rounded-2xl relative overflow-hidden shadow-inner flex-shrink-0 bg-brand-cream-100 dark:bg-brand-charcoal-800">
                <OptimizedImage
                  productId={previewProduct.id}
                  category={previewProduct.category}
                  src={previewProduct.image}
                  alt={previewProduct.name}
                  className="w-full h-full"
                />
              </div>

              {/* DETAILS CONTENT */}
              <div className="w-full flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-brand-orange-900/10 text-brand-orange-900 dark:bg-brand-gold-900/20 dark:text-brand-gold-900">
                      {previewProduct.categoryName}
                    </span>
                    <span className="text-[10px] text-brand-charcoal-400 font-bold uppercase">
                      GST {previewProduct.gstRate}% INCLUDED
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-tight">
                    {previewProduct.name}
                  </h3>

                  <p className="text-xs text-brand-charcoal-600 dark:text-brand-cream-300 leading-relaxed font-medium">
                    {previewProduct.description || 'Authentic Bansuri incense series crafted with traditional aromatic herbs and resins.'}
                  </p>

                  <div className="pt-2 space-y-2">
                    <label className="text-[10px] font-bold text-brand-charcoal-400 uppercase tracking-wider">
                      Select Size / Pack:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(previewProduct.sizes || []).map((s, idx) => {
                        const isSelected = (selectedSizes[previewProduct.id] || 0) === idx;
                        return (
                          <button
                            key={idx}
                            onClick={(e) => handleSizeSelect(previewProduct.id, idx, e)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-brand-orange-900 text-white dark:bg-brand-gold-900 dark:text-brand-charcoal-900 shadow'
                                : 'bg-brand-cream-100 dark:bg-brand-charcoal-800 text-brand-charcoal-700 dark:text-brand-cream-300'
                            }`}
                          >
                            {s.size} &bull; ₹{s.mrp}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* PRICING & ADD ACTION */}
                <div className="pt-4 border-t border-brand-orange-100/10 dark:border-brand-gold-900/10 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-bold text-brand-charcoal-400 uppercase">
                        Retail MRP
                      </span>
                      <div className="text-2xl font-black text-brand-charcoal-900 dark:text-brand-cream-50">
                        ₹{previewProduct.sizes?.[selectedSizes[previewProduct.id] || 0]?.mrp || previewProduct.price}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-brand-orange-900 dark:text-brand-gold-900 uppercase">
                        B2B Bulk: ₹{previewProduct.sizes?.[selectedSizes[previewProduct.id] || 0]?.b2bPrice || previewProduct.b2bPrice}
                      </span>
                      <p className="text-[10px] font-bold text-brand-charcoal-400 uppercase">
                        MOQ: {previewProduct.minB2bQty} Pcs
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const sIdx = selectedSizes[previewProduct.id] || 0;
                      const selectedSizeOpt = previewProduct.sizes?.[sIdx];
                      if (selectedSizeOpt) {
                        handleAddToCart(previewProduct, selectedSizeOpt);
                      }
                      setPreviewProduct(null);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 text-brand-cream-100 font-extrabold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-orange-900/20"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add Selected Pack to Basket</span>
                  </button>
                </div>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductListingPage;
