import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Grid, List, Star, Eye, X, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../../data/dummyData';
import type { Product } from '../../data/dummyData';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/api';
import CartQuantitySelector from '../../components/common/CartQuantitySelector';
import OptimizedImage from '../../components/common/OptimizedImage';

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 rounded-2xl p-4 flex flex-col justify-between space-y-4 animate-pulse">
    <div className="w-full h-40 bg-brand-cream-200 dark:bg-brand-charcoal-800 rounded-xl" />
    <div className="space-y-2">
      <div className="w-1/3 h-3 bg-brand-cream-200 dark:bg-brand-charcoal-800 rounded" />
      <div className="w-3/4 h-4 bg-brand-cream-200 dark:bg-brand-charcoal-800 rounded" />
      <div className="w-1/2 h-3 bg-brand-cream-200 dark:bg-brand-charcoal-800 rounded" />
    </div>
    <div className="flex justify-between items-center pt-2">
      <div className="w-1/4 h-5 bg-brand-cream-200 dark:bg-brand-charcoal-800 rounded" />
      <div className="w-8 h-8 bg-brand-cream-200 dark:bg-brand-charcoal-800 rounded-xl" />
    </div>
  </div>
);

export const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const isB2B = user?.isB2B || false;

  // Retrieve products using TanStack Query
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: apiService.getProducts,
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(1000);
  const [sortBy, setSortBy] = useState('popularity');
  const [isGridView, setIsGridView] = useState(true);
  
  // Quick preview states
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  // Sync with searchParams (e.g. from Home Page navigation clicks)
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);

    const pid = searchParams.get('id');
    if (pid && products.length > 0) {
      const match = products.find((p) => p.id === pid);
      if (match) {
        setPreviewProduct(match);
      }
    }
  }, [searchParams, products]);

  // Handle queries
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.origin.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    
    // Evaluate price based on B2B profile
    const activePrice = isB2B ? p.b2bPrice : p.price;
    const matchesPrice = activePrice <= priceRange;

    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    const priceA = isB2B ? a.b2bPrice : a.price;
    const priceB = isB2B ? b.b2bPrice : b.price;

    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount; // Popularity default
  });



  return (
    <div className="min-h-screen bg-brand-cream-50 dark:bg-brand-charcoal-900 transition-colors duration-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BANNER HEADER */}
        <div className="mb-12 text-center sm:text-left space-y-3">
          <h2 className="text-3xl font-extrabold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-tight">
            FMCG Wholesale Store
          </h2>
          <p className="text-xs text-brand-charcoal-600 dark:text-brand-cream-300 font-semibold uppercase tracking-widest">
            {filteredProducts.length} Premium Products Available
          </p>
        </div>

        {/* CONTROLS BAR: SEARCH & TOGGLES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: FILTERS PANEL */}
          <aside className="lg:col-span-3 p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-brand-orange-100/5 dark:border-brand-gold-900/5 text-brand-charcoal-900 dark:text-brand-cream-50">
              <span className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filter Options
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange(1000);
                  setSortBy('popularity');
                  setSearchParams({});
                }}
                className="text-[10px] text-brand-orange-900 dark:text-brand-gold-900 font-bold hover:underline"
              >
                RESET ALL
              </button>
            </div>

            {/* CATEGORY SELECTOR */}
            <div className="space-y-3">
              <label className="text-[11px] font-extrabold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-wider">
                Select Category
              </label>
              <div className="flex flex-col gap-2 text-xs font-bold text-brand-charcoal-700 dark:text-brand-cream-200">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchParams({});
                  }}
                  className={`text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-brand-orange-900/10 text-brand-orange-900 dark:bg-brand-gold-900/10 dark:text-brand-gold-900'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchParams({ category: cat.id });
                    }}
                    className={`text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-brand-orange-900/10 text-brand-orange-900 dark:bg-brand-gold-900/10 dark:text-brand-gold-900'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE SLIDER */}
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-extrabold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-wider">
                <span>Max Unit Price</span>
                <span className="text-brand-orange-900 dark:text-brand-gold-900 font-extrabold">
                  ₹{priceRange}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-brand-cream-200 dark:bg-brand-charcoal-800 rounded-lg appearance-none cursor-pointer accent-brand-orange-950 dark:accent-brand-gold-900"
              />
              <div className="flex justify-between text-[9px] font-semibold text-brand-charcoal-400">
                <span>₹20</span>
                <span>₹1000</span>
              </div>
            </div>

            {/* QUICK INFORMATION BADGE */}
            {isB2B && (
              <div className="p-4 rounded-xl border border-brand-gold-900/20 bg-brand-gold-900/5 space-y-1.5 animate-pulse-glow">
                <div className="flex items-center gap-1 text-xs text-brand-gold-900 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Wholesale Mode Active</span>
                </div>
                <p className="text-[10px] text-brand-charcoal-600 dark:text-brand-cream-300 leading-normal font-semibold">
                  You are eligible for verified supplier discounts. Bulk wholesale prices automatically apply to all single unit acquisitions.
                </p>
              </div>
            )}

          </aside>

          {/* RIGHT SIDEBAR: GRID VIEW & SEARCH PANEL */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* UTILITY CONTROL BAR */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm">
              
              {/* SEARCH FIELD */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal-400" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-50 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:border-brand-orange-900 dark:focus:border-brand-gold-900 transition-colors"
                />
              </div>

              {/* SORT & GRID/LIST TOGGLES */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                
                {/* SORT DROPDOWN */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-bold uppercase tracking-wider bg-brand-cream-50 dark:bg-brand-charcoal-950 border border-brand-charcoal-200 dark:border-brand-charcoal-800 rounded-xl px-3 py-2 text-brand-charcoal-850 dark:text-brand-cream-100 focus:outline-none"
                >
                  <option value="popularity">Popularity</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                {/* GIRD VIEW TOGGLE BUTTONS */}
                <div className="flex items-center gap-1 border border-brand-charcoal-200 dark:border-brand-charcoal-800 rounded-xl p-1 bg-brand-cream-50 dark:bg-brand-charcoal-950">
                  <button
                    onClick={() => setIsGridView(true)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isGridView
                        ? 'bg-brand-orange-900 text-brand-cream-100 dark:bg-brand-gold-900 dark:text-brand-charcoal-900 shadow-sm'
                        : 'text-brand-charcoal-450 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsGridView(false)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      !isGridView
                        ? 'bg-brand-orange-900 text-brand-cream-100 dark:bg-brand-gold-900 dark:text-brand-charcoal-900 shadow-sm'
                        : 'text-brand-charcoal-450 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* CORE GRID PRODUCTS LISTING */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 rounded-3xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
                <SlidersHorizontal className="w-12 h-12 text-brand-charcoal-400" />
                <h3 className="text-md font-bold uppercase text-brand-charcoal-900 dark:text-brand-cream-100">
                  No Matching Products Found
                </h3>
                <p className="text-xs text-brand-charcoal-500 max-w-[280px]">
                  Try adjusting your filters, modifying search tags, or resetting price limits.
                </p>
              </div>
            ) : isGridView ? (
              
              /* GRID VIEW LAYOUT */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const finalUnitPrice = isB2B ? p.b2bPrice : p.price;
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      onClick={() => {
                        setPreviewProduct(p);
                      }}
                      className="group/card bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm hover:shadow-xl hover:shadow-brand-orange-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                        {p.isBestseller && (
                          <span className="px-2 py-0.5 text-[8px] font-bold uppercase rounded-md bg-brand-orange-900 text-brand-cream-100 tracking-wider shadow">
                            Bestseller
                          </span>
                        )}
                        {p.isNew && (
                          <span className="px-2 py-0.5 text-[8px] font-bold uppercase rounded-md bg-brand-gold-900 text-brand-cream-100 tracking-wider shadow">
                            New Launch
                          </span>
                        )}
                      </div>

                      <div className="w-full h-40 rounded-xl shadow-inner mb-4 relative overflow-hidden">
                        <OptimizedImage
                          productId={p.id}
                          category={p.category}
                          alt={p.name}
                          className="w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <div className="w-10 h-10 rounded-full bg-white text-brand-charcoal-900 flex items-center justify-center shadow-md transform scale-90 group-hover/card:scale-100 transition-all">
                            <Eye className="w-5 h-5" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-extrabold text-brand-charcoal-900 dark:text-brand-cream-100">
                          {p.rating}
                        </span>
                        <span className="text-[9px] text-brand-charcoal-400 font-semibold">
                          ({p.reviewsCount})
                        </span>
                      </div>

                      <div className="space-y-1 mb-4">
                        <h3 className="text-xs font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-wide truncate">
                          {p.name}
                        </h3>
                        <p className="text-[10px] text-brand-charcoal-500 dark:text-brand-cream-300 font-semibold">
                          {p.unit} &bull; {p.origin.split(',')[0]}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-brand-orange-100/5 dark:border-brand-gold-900/5 pt-3">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-brand-charcoal-900 dark:text-brand-cream-50">
                              ₹{finalUnitPrice}
                            </span>
                            {!isB2B && (
                              <span className="text-[9px] text-brand-charcoal-400 line-through">
                                ₹{p.price}
                              </span>
                            )}
                          </div>
                          <p className="text-[8px] text-brand-orange-950 dark:text-brand-gold-900 font-bold uppercase mt-0.5 leading-none">
                            {isB2B ? 'Wholesale Price' : `B2B: ₹${p.b2bPrice} (min ${p.minB2bQty})`}
                          </p>
                        </div>

                        <div className="w-[90px]" onClick={(e) => e.stopPropagation()}>
                          <CartQuantitySelector product={p} size="sm" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              
              /* LIST VIEW LAYOUT */
              <div className="space-y-4">
                {filteredProducts.map((p) => {
                  const finalUnitPrice = isB2B ? p.b2bPrice : p.price;
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      onClick={() => {
                        setPreviewProduct(p);
                      }}
                      className="group/card bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm hover:shadow-lg rounded-2xl p-4 flex items-center justify-between gap-6 cursor-pointer relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-4 flex-grow">
                        <div className="w-20 h-20 rounded-xl shadow-inner relative overflow-hidden flex-shrink-0">
                          <OptimizedImage
                            productId={p.id}
                            category={p.category}
                            alt={p.name}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-wide">
                              {p.name}
                            </h3>
                            <div className="flex gap-1">
                              {p.isBestseller && (
                                <span className="px-1.5 py-0.5 text-[7px] font-bold uppercase rounded bg-brand-orange-900 text-brand-cream-100">
                                  Bestseller
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-[10px] text-brand-charcoal-500 dark:text-brand-cream-300 font-semibold line-clamp-1 max-w-md">
                            {p.description}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-brand-charcoal-400 font-semibold">
                            <span>{p.unit}</span>
                            <span>&bull;</span>
                            <span>{p.origin}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {p.rating} ({p.reviewsCount})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 flex-shrink-0 text-right">
                        <div>
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="text-sm font-black text-brand-charcoal-900 dark:text-brand-cream-50">
                              ₹{finalUnitPrice}
                            </span>
                            {!isB2B && (
                              <span className="text-[9px] text-brand-charcoal-400 line-through">
                                ₹{p.price}
                              </span>
                            )}
                          </div>
                          <p className="text-[8px] text-brand-orange-950 dark:text-brand-gold-900 font-bold uppercase mt-0.5 leading-none">
                            {isB2B ? 'Wholesale enabled' : `B2B: ₹${p.b2bPrice}`}
                          </p>
                        </div>
                        <div className="w-[100px]" onClick={(e) => e.stopPropagation()}>
                          <CartQuantitySelector product={p} size="sm" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

          </main>

        </div>

      </div>

      {/* QUICK PREVIEW DYNAMIC MODAL */}
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
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="fixed inset-x-4 top-[10%] bottom-[10%] sm:inset-y-auto sm:top-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:w-full sm:left-1/2 sm:-translate-x-1/2 z-50 bg-brand-cream-50 dark:bg-brand-charcoal-900 border border-brand-orange-100/10 dark:border-brand-gold-900/10 shadow-2xl rounded-3xl p-6 sm:p-8 flex flex-col sm:grid sm:grid-cols-2 gap-8 items-start overflow-y-auto no-scrollbar transition-colors duration-300"
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setPreviewProduct(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-brand-charcoal-500 dark:text-brand-cream-300 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LEFT: PRODUCT IMAGE PREVIEW */}
              <div className="w-full aspect-square sm:aspect-auto sm:h-full rounded-2xl relative overflow-hidden shadow-inner flex-shrink-0">
                <OptimizedImage
                  productId={previewProduct.id}
                  category={previewProduct.category}
                  alt={previewProduct.name}
                  className="w-full h-full"
                />
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-black/40 backdrop-blur-md text-[10px] text-brand-cream-100 font-bold uppercase tracking-wider text-center border border-white/10">
                  FMCG ORIGIN: {previewProduct.origin}
                </div>
              </div>

              {/* RIGHT: DETAILED INFO PANEL */}
              <div className="w-full flex flex-col justify-between h-full space-y-6 sm:space-y-0">
                <div className="space-y-4">
                  {/* B2B STATUS CARD */}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[8px] font-bold uppercase rounded bg-brand-orange-900 text-brand-cream-100 tracking-wider">
                      GST {previewProduct.gstRate}% Included
                    </span>
                    <span className="text-[9px] text-brand-charcoal-400 font-semibold">
                      ID: {previewProduct.id.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-wide">
                    {previewProduct.name}
                  </h3>

                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-brand-charcoal-900 dark:text-brand-cream-100">
                      {previewProduct.rating}
                    </span>
                    <span className="text-[10px] text-brand-charcoal-400 font-semibold">
                      ({previewProduct.reviewsCount} verified audits)
                    </span>
                  </div>

                  <p className="text-xs text-brand-charcoal-600 dark:text-brand-cream-300 leading-relaxed font-semibold">
                    {previewProduct.description}
                  </p>

                  <div className="space-y-2 text-[10px] font-bold text-brand-charcoal-600 dark:text-brand-cream-300 uppercase tracking-wider">
                    <div className="flex justify-between">
                      <span>Package Type</span>
                      <span className="text-brand-charcoal-900 dark:text-brand-cream-100">{previewProduct.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Store dispatch</span>
                      <span className="text-emerald-600">{previewProduct.deliveryEstimate}</span>
                    </div>
                  </div>
                </div>

                {/* PRICING & ACTIONS */}
                <div className="border-t border-brand-orange-100/10 dark:border-brand-gold-900/10 pt-6 space-y-4">
                  
                  {/* PRICING TIER */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] text-brand-charcoal-400 font-bold uppercase">
                        Active Price Bracket
                      </p>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-2xl font-black text-brand-charcoal-900 dark:text-brand-cream-50">
                          ₹{isB2B ? previewProduct.b2bPrice : previewProduct.price}
                        </span>
                        {!isB2B && (
                          <span className="text-xs text-brand-charcoal-400 line-through">
                            ₹{previewProduct.price}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* WHOLESALE B2B SAVINGS */}
                    <div className="text-right">
                      <span className="text-[9px] px-2 py-1 rounded bg-brand-gold-900/10 text-brand-gold-900 font-bold uppercase">
                        B2B Qty Trigger: {previewProduct.minB2bQty} Pcs
                      </span>
                      <p className="text-[8px] text-brand-charcoal-400 font-bold mt-1">
                        Unlocks ₹{previewProduct.b2bPrice} Wholesale Pricing
                      </p>
                    </div>
                  </div>

                  {/* QUANTITY PICKER & ACTIONS */}
                  <div className="w-full">
                    <CartQuantitySelector product={previewProduct} size="lg" />
                  </div>

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
