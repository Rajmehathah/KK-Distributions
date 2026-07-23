import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  Sparkles,
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
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export interface CategoryCardData {
  id: string;
  name: string;
  count: string;
  description: string;
  products?: string[];
  route: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_SERIES: CategoryCardData[] = [
  {
    id: 'packet-series',
    name: 'Packet Series (Regular)',
    count: '8 Products',
    products: ['Classic', 'Vibe', 'Pineapple', 'Mogra', 'Lavender', 'Chandan', 'Champa', 'Rose'],
    description: 'Traditional daily-use incense collection available in multiple fragrances and pack sizes.',
    route: '/orders?category=packet-series',
    icon: Flame,
  },
  {
    id: 'premium-packet-series',
    name: 'Premium Packet Series',
    count: '3 Products',
    products: ['Classic', 'Lavender', 'MY3'],
    description: 'Large premium packs for long-lasting fragrance and wholesale customers.',
    route: '/orders?category=premium-packet-series',
    icon: Sparkles,
  },
  {
    id: 'special-series',
    name: 'Special Series',
    count: '4 Products',
    products: ['Beats', 'Melody', 'Natya', 'Kisna'],
    description: 'Premium signature fragrances with unique aromatic blends.',
    route: '/orders?category=special-series',
    icon: Crown,
  },
  {
    id: 'pouch-series',
    name: 'Pouch Series',
    count: '8 Products',
    description: 'Economical pouch packs suitable for everyday use.',
    route: '/orders?category=pouch-series',
    icon: Package,
  },
  {
    id: 'special-pouch-series',
    name: 'Special Pouch Series',
    count: '4 Products',
    description: 'Premium fragrance pouches featuring signature blends.',
    route: '/orders?category=special-pouch-series',
    icon: Box,
  },
  {
    id: 'premium-pouch-series',
    name: 'Premium Pouch Series',
    count: '9 Products',
    description: 'Large premium stand-up pouches for homes and retailers.',
    route: '/orders?category=premium-pouch-series',
    icon: ShoppingBag,
  },
  {
    id: 'premium-special-pouch-series',
    name: 'Premium Special Pouch Series',
    count: '4 Products',
    description: 'Premium special fragrance pouches in large packs.',
    route: '/orders?category=premium-special-pouch-series',
    icon: Award,
  },
  {
    id: 'wet-dhoop',
    name: 'Wet Dhoop Series',
    count: '4 Products',
    description: 'Traditional wet dhoop cones for temples and pooja.',
    route: '/orders?category=wet-dhoop',
    icon: Droplet,
  },
  {
    id: 'premium-wet-dhoop',
    name: 'Premium Wet Dhoop Series',
    count: '5 Products',
    description: 'Deluxe wet dhoop collection with richer fragrance.',
    route: '/orders?category=premium-wet-dhoop',
    icon: FlameKindling,
  },
  {
    id: 'solid-dhoop',
    name: 'Solid Dhoop Series',
    count: '4 Products',
    description: 'Solid dhoop jars crafted for long-lasting spiritual aroma.',
    route: '/orders?category=solid-dhoop',
    icon: Layers,
  },
  {
    id: 'sambrani',
    name: 'Sambrani Series',
    count: '5 Products',
    description: 'Traditional sambrani, cones and cup sambrani products.',
    route: '/orders?category=sambrani',
    icon: Flower2,
  },
  {
    id: 'vasu-series',
    name: 'Vasu Series',
    count: '3 Products',
    description: 'Premium devotional incense inspired by temple traditions.',
    route: '/orders?category=vasu-series',
    icon: ShieldCheck,
  },
  {
    id: 'hexa-series',
    name: 'Hexa Series',
    count: '4 Products',
    description: 'Compact Hexa incense sticks available in signature fragrances.',
    route: '/orders?category=hexa-series',
    icon: Hexagon,
  },
];

export const CategoryCarousel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-24 bg-[#FAF8F5] dark:bg-brand-charcoal-950 border-t border-brand-orange-100/10 dark:border-brand-gold-900/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* LEFT SIDE COLUMN */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start space-y-8">
            <div className="space-y-4">
              {/* Small Orange Label */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange-900/10 dark:bg-brand-gold-900/10 border border-brand-orange-900/20 dark:border-brand-gold-900/20 text-brand-orange-900 dark:text-brand-gold-900 text-xs font-extrabold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PREMIUM COLLECTION</span>
              </div>

              {/* Large Heading */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-tight leading-[0.95]">
                OUR
                <br />
                PRODUCTS
              </h2>

              {/* Small Description */}
              <p className="text-sm sm:text-base text-brand-charcoal-600 dark:text-brand-cream-300 font-medium leading-relaxed max-w-md">
                Explore our complete collection of premium incense, dhoop and spiritual products crafted with tradition and quality.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 pt-2">
              <button
                onClick={() => navigate('/orders')}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 text-brand-cream-100 font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-brand-orange-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/dealer')}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border-2 border-brand-orange-900/30 dark:border-brand-gold-900/30 bg-white/50 dark:bg-brand-charcoal-900/50 hover:bg-brand-orange-900/10 dark:hover:bg-brand-gold-900/10 text-brand-charcoal-900 dark:text-brand-cream-50 font-extrabold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Become a Dealer</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE GRID */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CATEGORY_SERIES.map((cat, index) => {
                const IconComp = cat.icon;
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => navigate(cat.route)}
                    className="group relative bg-white dark:bg-brand-charcoal-900 rounded-[24px] p-6 sm:p-7 border border-brand-orange-100/10 dark:border-brand-gold-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_16px_32px_rgba(234,88,12,0.12)] hover:border-brand-orange-500/40 hover:ring-1 hover:ring-brand-orange-500/20 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full overflow-hidden"
                  >
                    <div>
                      {/* Top Bar: Orange Icon + Product Count Badge */}
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-brand-orange-900/10 dark:bg-brand-gold-900/20 text-brand-orange-900 dark:text-brand-gold-900 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-brand-orange-900 group-hover:to-brand-gold-900 group-hover:text-brand-cream-100 transition-all duration-300 shadow-sm">
                          <IconComp className="w-6 h-6" />
                        </div>

                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-brand-orange-900/10 text-brand-orange-900 dark:bg-brand-gold-900/15 dark:text-brand-gold-900 border border-brand-orange-900/15 dark:border-brand-gold-900/20">
                          {cat.count}
                        </span>
                      </div>

                      {/* Card Info */}
                      <div className="space-y-2.5">
                        <h3 className="text-lg sm:text-xl font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-tight group-hover:text-brand-orange-950 dark:group-hover:text-brand-gold-900 transition-colors">
                          {cat.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-brand-charcoal-600 dark:text-brand-cream-300 font-medium leading-relaxed">
                          {cat.description}
                        </p>

                        {cat.products && cat.products.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {cat.products.map((p, pIdx) => (
                              <span
                                key={pIdx}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-cream-100 dark:bg-brand-charcoal-800 text-brand-charcoal-700 dark:text-brand-cream-200 border border-brand-orange-100/5 dark:border-brand-gold-900/10"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-5 mt-5 border-t border-brand-orange-100/10 dark:border-brand-gold-900/10 flex items-center justify-between text-xs font-extrabold uppercase tracking-widest text-brand-orange-900 dark:text-brand-gold-900 group-hover:text-brand-orange-950 dark:group-hover:text-brand-gold-800">
                      <span>Explore</span>
                      <div className="w-8 h-8 rounded-full bg-brand-orange-900/10 dark:bg-brand-gold-900/10 flex items-center justify-center group-hover:bg-brand-orange-900 group-hover:text-brand-cream-100 dark:group-hover:bg-brand-gold-900 dark:group-hover:text-brand-charcoal-900 group-hover:translate-x-1 transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;

