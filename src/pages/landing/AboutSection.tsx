import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Zap, Users, Store, Network } from 'lucide-react';

interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
}

const CountUp: React.FC<CountUpProps> = ({ end, suffix = '', duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = end / (duration * 60);
    const handle = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(handle);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(handle);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="font-extrabold text-3xl sm:text-4xl text-brand-orange-900 dark:text-brand-gold-900 leading-none">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export const AboutSection: React.FC = () => {
  return (
    <section id="about-network" className="py-24 bg-brand-cream-50 dark:bg-brand-charcoal-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-brand-orange-900 dark:text-brand-gold-900">
            <Network className="w-4 h-4" />
            <span>Robust Distribution Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase">
            Bridging Traditional Shops To Modern E-Commerce
          </h2>
          <p className="text-xs sm:text-sm text-brand-charcoal-600 dark:text-brand-cream-300 font-medium">
            For over a decade, our physical sales representatives have visited wholesale and retail stores. Today, we digitize that trust—enabling instant order placement, full invoice transparency, and guaranteed 24-hour delivery.
          </p>
        </div>

        {/* STATS COUNT GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-brand-orange-900/10 dark:bg-brand-gold-900/10 text-brand-orange-900 dark:text-brand-gold-900 flex items-center justify-center mb-1">
              <Store className="w-6 h-6" />
            </div>
            <CountUp end={500} suffix="+" />
            <span className="text-[10px] sm:text-xs font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
              Retail Stores
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-brand-orange-900/10 dark:bg-brand-gold-900/10 text-brand-orange-900 dark:text-brand-gold-900 flex items-center justify-center mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <CountUp end={50000} suffix="+" />
            <span className="text-[10px] sm:text-xs font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
              Orders Delivered
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-brand-orange-900/10 dark:bg-brand-gold-900/10 text-brand-orange-900 dark:text-brand-gold-900 flex items-center justify-center mb-1">
              <Users className="w-6 h-6" />
            </div>
            <CountUp end={6} />
            <span className="text-[10px] sm:text-xs font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
              Product Categories
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-brand-orange-900/10 dark:bg-brand-gold-900/10 text-brand-orange-900 dark:text-brand-gold-900 flex items-center justify-center mb-1">
              <Zap className="w-6 h-6" />
            </div>
            <CountUp end={24} suffix="hr Support" />
            <span className="text-[10px] sm:text-xs font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
              Delivery Turnaround
            </span>
          </div>

        </div>

        {/* WORKFLOW PIPELINE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: SVG ILLUSTRATION WORKFLOW */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm flex items-center justify-center relative overflow-hidden h-[340px]">
            
            {/* GLOW DECORATOR */}
            <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-brand-gold-900/15 blur-2xl" />

            <svg viewBox="0 0 400 300" className="w-full h-full text-brand-charcoal-800 dark:text-brand-cream-200">
              {/* Warehouse Node */}
              <circle cx="200" cy="60" r="28" fill="url(#brandGrad)" className="shadow-md" />
              <text x="200" y="64" fill="#FCF9F2" fontSize="9" fontWeight="bold" textAnchor="middle">KK WAREHOUSE</text>
              
              {/* Connections */}
              <line x1="200" y1="88" x2="100" y2="180" stroke="#E65100" strokeWidth="2" strokeDasharray="5" />
              <line x1="200" y1="88" x2="200" y2="210" stroke="#FFB300" strokeWidth="2" />
              <line x1="200" y1="88" x2="300" y2="180" stroke="#E65100" strokeWidth="2" strokeDasharray="5" />

              {/* Retail Nodes */}
              <circle cx="100" cy="180" r="18" className="fill-white dark:fill-brand-charcoal-950 stroke-brand-orange-950 stroke-[2]" />
              <text x="100" y="183" fontSize="8" fontWeight="bold" textAnchor="middle" className="fill-brand-charcoal-900 dark:fill-brand-cream-50">SHOP A</text>

              <circle cx="200" cy="210" r="18" className="fill-white dark:fill-brand-charcoal-950 stroke-brand-gold-900 stroke-[2]" />
              <text x="200" y="213" fontSize="8" fontWeight="bold" textAnchor="middle" className="fill-brand-charcoal-900 dark:fill-brand-cream-50">SHOP B</text>

              <circle cx="300" cy="180" r="18" className="fill-white dark:fill-brand-charcoal-950 stroke-brand-orange-950 stroke-[2]" />
              <text x="300" y="183" fontSize="8" fontWeight="bold" textAnchor="middle" className="fill-brand-charcoal-900 dark:fill-brand-cream-50">SHOP C</text>

              {/* Animated Truck/Delivery Vectors */}
              <motion.circle
                cx="200"
                cy="88"
                r="6"
                fill="#FFB300"
                animate={{ cx: [200, 100, 200, 300, 200], cy: [88, 180, 88, 180, 88] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
              />

              {/* Gradients */}
              <defs>
                <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E65100" />
                  <stop offset="100%" stopColor="#FFB300" />
                </linearGradient>
              </defs>
            </svg>

          </div>

          {/* RIGHT: TIMELINE WORKFLOW DESCRIPTION */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xl font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase">
              Next-Day Delivery Mechanics
            </h3>

            {/* TIMELINE STEP 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border border-brand-orange-500/20 bg-brand-orange-500/5 text-brand-orange-900 dark:text-brand-orange-300 flex items-center justify-center text-xs font-bold">
                  01
                </div>
                <div className="w-0.5 h-full bg-brand-orange-500/10 min-h-[30px]" />
              </div>
              <div className="pb-4">
                <h4 className="text-xs font-extrabold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase">
                  Sales Agent Audit OR Mobile Order Placement
                </h4>
                <p className="text-[11px] text-brand-charcoal-500 dark:text-brand-cream-300 font-semibold leading-relaxed mt-1">
                  Store managers place bulk orders through this portal directly, or our physical field executives audit inventory levels and register requests on their tablets.
                </p>
              </div>
            </div>

            {/* TIMELINE STEP 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border border-brand-gold-900/20 bg-brand-gold-900/5 text-brand-gold-900 flex items-center justify-center text-xs font-bold">
                  02
                </div>
                <div className="w-0.5 h-full bg-brand-orange-500/10 min-h-[30px]" />
              </div>
              <div className="pb-4">
                <h4 className="text-xs font-extrabold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase">
                  Evening Dispatch and Routing
                </h4>
                <p className="text-[11px] text-brand-charcoal-500 dark:text-brand-cream-300 font-semibold leading-relaxed mt-1">
                  Orders close daily by 6:00 PM. Our Yeshwanthpur automated warehouse packs crates, issues computerized invoices, and drafts delivery trucks.
                </p>
              </div>
            </div>

            {/* TIMELINE STEP 3 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border border-brand-orange-500/20 bg-brand-orange-500/5 text-brand-orange-900 dark:text-brand-orange-300 flex items-center justify-center text-xs font-bold">
                  03
                </div>
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase">
                  Guaranteed Morning Delivery
                </h4>
                <p className="text-[11px] text-brand-charcoal-500 dark:text-brand-cream-300 font-semibold leading-relaxed mt-1">
                  By 10:00 AM next morning, our delivery vans reach the retail locations. Items are hand-delivered, verified, and settled with digital receipt updates.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
export default AboutSection;
