import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Sparkles, Cookie, Flame, CupSoda, ShieldCheck, ShoppingBag, Eye } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../../data/dummyData';
import type { Product } from '../../data/dummyData';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../store/toastStore';
import OptimizedImage from '../../components/common/OptimizedImage';

const iconMap: Record<string, React.ComponentType<any>> = {
  Sparkles,
  Cookie,
  Flame,
  CupSoda,
  ShieldCheck,
  ShoppingBag,
};

export const CategoryCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0].id);
  const productsScrollRef = useRef<HTMLDivElement>(null);

  const isB2B = user?.isB2B || false;

  const filteredProducts = PRODUCTS.filter((p) => p.category === selectedCat).slice(0, 6);

  const scroll = (direction: 'left' | 'right') => {
    if (productsScrollRef.current) {
      const { scrollLeft } = productsScrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 320 : scrollLeft + 320;
      productsScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    addItem(product, 1);
    showToast(`Added ${product.name} to cart.`, 'success');
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products?id=${productId}`);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-brand-cream-50 to-brand-cream-100 dark:from-brand-charcoal-950 dark:to-brand-charcoal-900 border-t border-brand-orange-100/5 dark:border-brand-gold-900/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange-900 dark:text-brand-gold-900">
              Premium Showcase
            </span>
            <h2 className="text-3xl font-extrabold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-tight">
              Explore Our Catalog
            </h2>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-xs font-extrabold uppercase tracking-widest text-brand-orange-900 dark:text-brand-gold-900 hover:text-brand-orange-700 dark:hover:text-brand-gold-800 transition-colors flex items-center gap-1 hover:underline"
          >
            <span>View Full Catalog ({PRODUCTS.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* CATEGORIES BUTTONS BAR */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const IconComp = iconMap[cat.icon] || ShoppingBag;
            const isSelected = selectedCat === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`flex items-center gap-2.5 px-6 py-4 rounded-2xl border text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected
                    ? 'bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 border-transparent text-brand-cream-100 shadow-md shadow-brand-orange-900/10'
                    : 'bg-white dark:bg-brand-charcoal-900 border-brand-orange-100/10 dark:border-brand-gold-900/10 text-brand-charcoal-700 dark:text-brand-cream-300 hover:border-brand-orange-900/30'
                }`}
              >
                <IconComp className={`w-4 h-4 ${isSelected ? 'text-brand-cream-100' : 'text-brand-orange-900 dark:text-brand-gold-900'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* PRODUCT CAROUSEL VIEWPORT */}
        <div className="relative mt-8 group/carousel">
          
          {/* NAVIGATION CHEVRONS */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-xl bg-white/90 dark:bg-brand-charcoal-900/90 border border-brand-orange-100/10 dark:border-brand-gold-900/10 shadow-lg text-brand-charcoal-800 dark:text-brand-cream-50 flex items-center justify-center hover:bg-brand-orange-900 hover:text-brand-cream-100 dark:hover:bg-brand-gold-900 transition-all opacity-0 group-hover/carousel:opacity-100 -left-5"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-xl bg-white/90 dark:bg-brand-charcoal-900/90 border border-brand-orange-100/10 dark:border-brand-gold-900/10 shadow-lg text-brand-charcoal-800 dark:text-brand-cream-50 flex items-center justify-center hover:bg-brand-orange-900 hover:text-brand-cream-100 dark:hover:bg-brand-gold-900 transition-all opacity-0 group-hover/carousel:opacity-100 -right-5"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* DYNAMIC PRODUCT SLIDER GRID */}
          <div
            ref={productsScrollRef}
            className="flex gap-6 overflow-x-auto py-4 px-2 no-scrollbar scroll-smooth"
          >
            <AnimatePresence mode="wait">
              {filteredProducts.map((p) => {
                const finalUnitPrice = isB2B ? p.b2bPrice : p.price;
                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => handleProductClick(p.id)}
                    className="w-[280px] flex-shrink-0 group/card bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm hover:shadow-xl hover:shadow-brand-orange-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer relative overflow-hidden"
                  >
                    {/* TOP BADGES */}
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

                    {/* PRODUCT VISUAL IMAGE */}
                    <div className="w-full h-44 rounded-xl shadow-inner mb-4 flex items-center justify-center relative overflow-hidden border border-brand-sandalwood-500/10 dark:border-brand-gold-900/10">
                      <OptimizedImage
                        productId={p.id}
                        category={p.category}
                        alt={p.name}
                        className="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white text-brand-charcoal-900 flex items-center justify-center shadow-md transform translate-y-3 group-hover/card:translate-y-0 transition-all duration-300">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* RATINGS */}
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-extrabold text-brand-charcoal-900 dark:text-brand-cream-100">
                        {p.rating}
                      </span>
                      <span className="text-[9px] text-brand-charcoal-400 dark:text-brand-cream-300 font-semibold">
                        ({p.reviewsCount})
                      </span>
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-1 mb-4">
                      <h3 className="text-xs font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-wide truncate">
                        {p.name}
                      </h3>
                      <p className="text-[10px] text-brand-charcoal-500 dark:text-brand-cream-300 font-semibold">
                        {p.unit} &bull; {p.origin.split(',')[0]}
                      </p>
                    </div>

                    {/* FOOTER ACTIONS */}
                    <div className="flex items-center justify-between border-t border-brand-orange-100/5 dark:border-brand-gold-900/5 pt-3.5">
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
                        <p className="text-[8px] text-brand-orange-900 dark:text-brand-gold-900 font-bold uppercase mt-0.5">
                          {isB2B ? 'Wholesale Enabled' : `B2B: ₹${p.b2bPrice} (min ${p.minB2bQty})`}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, p)}
                        className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 text-brand-cream-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-brand-orange-900/10"
                        title="Add to Basket"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
export default CategoryCarousel;
