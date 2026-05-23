import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, ShieldCheck, Clock, Zap, Sparkles, Truck } from 'lucide-react';
import { gsap } from 'gsap';
import { useMagneticButton, useScrollReveal } from '../../animations/gsapEffects';
import IncenseSmokeParticles from '../../components/common/IncenseSmokeParticles';
import OptimizedImage from '../../components/common/OptimizedImage';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  // Create references for GSAP animations
  const startOrderingRef = useRef<HTMLButtonElement>(null);
  const exploreNetworkRef = useRef<HTMLButtonElement>(null);
  
  const headingRef = useRef<HTMLHeadingElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const centerShieldRef = useRef<HTMLDivElement>(null);

  // Bind magnetic button behaviors
  useMagneticButton(startOrderingRef, 25);
  useMagneticButton(exploreNetworkRef, 20);

  // Bind entry scroll/blur reveals
  useScrollReveal(headingRef, 'up', 0.1);

  // Infinite floating card microinteractions with GSAP
  useEffect(() => {
    if (card1Ref.current) {
      gsap.to(card1Ref.current, {
        y: '+=16',
        x: '-=6',
        rotation: '+=3',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    if (card2Ref.current) {
      gsap.to(card2Ref.current, {
        y: '-=14',
        x: '+=5',
        rotation: '-=4',
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.3,
      });
    }

    if (centerShieldRef.current) {
      gsap.to(centerShieldRef.current, {
        scale: 1.05,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.1,
      });
    }
  }, []);

  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:py-32 bg-gradient-to-b from-brand-cream-50 via-brand-cream-100 to-brand-cream-200 dark:from-brand-charcoal-950 dark:via-brand-charcoal-900 dark:to-brand-charcoal-950 transition-colors duration-300">
      
      {/* INCENSE SMOKE PARTICLE LAYER IN BACKDROP */}
      <IncenseSmokeParticles opacity={0.5} />

      {/* SHIFTING SANDALWOOD & GOLD GRADIENT BACKDROP */}
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-brand-sandalwood-500/10 to-brand-gold-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-brand-sandalwood-600/5 to-brand-gold-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT COLUMN: TYPOGRAPHY & CTAS */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* FLOATING DIRECT BADGES */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold-500/20 bg-brand-sandalwood-900/5 dark:bg-brand-gold-900/5 text-brand-sandalwood-900 dark:text-brand-gold-400 text-xs font-bold uppercase tracking-wider mx-auto lg:mx-0 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-gold-900 animate-pulse" />
              <span className="font-semibold text-brand-sandalwood-800 dark:text-brand-gold-300">Premium Sacred Incense & FMCG Distributorship</span>
            </motion.div>

            {/* MAIN BLUR REVEAL HEADLINE */}
            <h2
              ref={headingRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-charcoal-900 dark:text-brand-cream-50 leading-[1.1] tracking-tight uppercase"
            >
              Delivering <span className="text-gradient">Sacred Incense</span> & Trusted FMCG Products
            </h2>

            {/* SUBTITLE */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm sm:text-base text-brand-charcoal-600 dark:text-brand-cream-300 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              KK Distributions bridges premium spiritual incense craftsmanship and wholesale daily essentials. Access factory direct pricing, verified merchants margins, and 24-hour express store delivery.
            </motion.p>

            {/* CTAS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                ref={startOrderingRef}
                onClick={() => navigate('/products')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-tr from-brand-sandalwood-900 to-brand-gold-900 hover:shadow-xl hover:shadow-brand-sandalwood-900/20 text-sm font-bold text-brand-cream-100 uppercase tracking-widest transition-all duration-300 cursor-pointer"
              >
                <span>Start Ordering</span>
                <ShoppingCart className="w-4 h-4" />
              </button>
              <button
                ref={exploreNetworkRef}
                onClick={() => {
                  const element = document.getElementById('about-network');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-brand-sandalwood-300 dark:border-brand-sandalwood-800 bg-white/40 dark:bg-brand-charcoal-950/40 hover:bg-black/5 dark:hover:bg-white/5 text-sm font-bold text-brand-sandalwood-800 dark:text-brand-cream-100 uppercase tracking-widest transition-all duration-300 cursor-pointer"
              >
                <span>Explore Network</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* THREE FLOATING PROPOSITIONS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-sandalwood-100/10 dark:border-brand-gold-900/10"
            >
              <div className="flex flex-col items-center lg:items-start gap-1">
                <div className="flex items-center gap-1.5 text-brand-sandalwood-700 dark:text-brand-gold-800">
                  <Clock className="w-4 h-4 text-brand-sandalwood-500 dark:text-brand-gold-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-sandalwood-900 dark:text-brand-gold-400">24h Delivery</span>
                </div>
                <p className="text-[10px] text-brand-charcoal-500 dark:text-brand-cream-300 font-semibold text-center lg:text-left">
                  Same-day bulk dispatch
                </p>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1">
                <div className="flex items-center gap-1.5 text-brand-sandalwood-700 dark:text-brand-gold-800">
                  <ShieldCheck className="w-4 h-4 text-brand-sandalwood-500 dark:text-brand-gold-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-sandalwood-900 dark:text-brand-gold-400">GST Invoice</span>
                </div>
                <p className="text-[10px] text-brand-charcoal-500 dark:text-brand-cream-300 font-semibold text-center lg:text-left">
                  Seamless wholesale returns
                </p>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1">
                <div className="flex items-center gap-1.5 text-brand-sandalwood-700 dark:text-brand-gold-800">
                  <Zap className="w-4 h-4 text-brand-sandalwood-500 dark:text-brand-gold-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-sandalwood-900 dark:text-brand-gold-400">Best Rates</span>
                </div>
                <p className="text-[10px] text-brand-charcoal-500 dark:text-brand-cream-300 font-semibold text-center lg:text-left">
                  Factory-direct wholesale
                </p>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: CINEMATIC FLOATING CARDS */}
          <div className="lg:col-span-5 relative w-full h-[450px] flex items-center justify-center">
            
            {/* FLOATING CARD 1: CYCLE PURE SANDAL AGARBATHI */}
            <div
              ref={card1Ref}
              onClick={() => navigate('/products?id=bansuri-packet-classic-120')}
              className="absolute top-[5%] left-[2%] w-[190px] p-3 rounded-2xl bg-white/80 dark:bg-brand-charcoal-900/80 border border-brand-sandalwood-500/20 dark:border-brand-gold-900/30 shadow-2xl backdrop-blur-md transform -rotate-6 transition-all duration-300 hover:z-20 group cursor-pointer"
            >
              <div className="w-full h-32 rounded-xl overflow-hidden mb-3 shadow-inner relative">
                <OptimizedImage
                  productId="bansuri-packet-classic-120"
                  category="bansuri-packet"
                  alt="Cycle Pure Sandal Agarbathi"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-sandalwood-950/40 to-transparent" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand-gold-900 text-brand-cream-50 font-bold text-[8px] uppercase tracking-wider shadow-sm">
                  Best Seller
                </span>
              </div>
              <h4 className="text-[11px] font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-tight line-clamp-1 group-hover:text-brand-sandalwood-500 dark:group-hover:text-brand-gold-400 transition-colors">
                CYCLE PURE SANDAL AGARBATHI
              </h4>
              <p className="text-[10px] text-brand-sandalwood-900 dark:text-brand-gold-500 font-extrabold uppercase mt-0.5">
                B2B: ₹90 / PACK
              </p>
              <div className="flex items-center gap-1 mt-1 text-[8px] text-brand-charcoal-400 dark:text-brand-cream-400 font-medium">
                <Sparkles className="w-2.5 h-2.5 text-brand-gold-900" />
                <span>Pure Sandalwood Extract</span>
              </div>
            </div>

            {/* FLOATING CARD 2: NANDITA DIVINE LAVENDER AGARBATHI */}
            <div
              ref={card2Ref}
              onClick={() => navigate('/products?id=bansuri-packet-lavender-120')}
              className="absolute bottom-[5%] right-[2%] w-[190px] p-3 rounded-2xl bg-white/80 dark:bg-brand-charcoal-900/80 border border-brand-sandalwood-500/20 dark:border-brand-gold-900/30 shadow-2xl backdrop-blur-md transform rotate-3 transition-all duration-300 hover:z-20 group cursor-pointer"
            >
              <div className="w-full h-32 rounded-xl overflow-hidden mb-3 shadow-inner relative">
                <OptimizedImage
                  productId="bansuri-packet-lavender-120"
                  category="bansuri-packet"
                  alt="Nandita Divine Lavender Agarbathi"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-sandalwood-950/40 to-transparent" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand-sandalwood-900 text-brand-cream-50 font-bold text-[8px] uppercase tracking-wider shadow-sm">
                  Premium Blend
                </span>
              </div>
              <h4 className="text-[11px] font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-tight line-clamp-1 group-hover:text-brand-sandalwood-500 dark:group-hover:text-brand-gold-400 transition-colors">
                NANDITA DIVINE LAVENDER AGARBATHI
              </h4>
              <p className="text-[10px] text-brand-sandalwood-900 dark:text-brand-gold-500 font-extrabold uppercase mt-0.5">
                B2B: ₹85 / PACK
              </p>
              <div className="flex items-center gap-1 mt-1 text-[8px] text-brand-charcoal-400 dark:text-brand-cream-400 font-medium">
                <Sparkles className="w-2.5 h-2.5 text-brand-gold-900" />
                <span>Long Lasting Fragrance</span>
              </div>
            </div>

            {/* CENTER SHIELD GLOWING CIRCLE */}
            <div
              ref={centerShieldRef}
              className="w-48 h-48 rounded-full border border-brand-sandalwood-900/20 bg-brand-cream-100/50 dark:bg-brand-charcoal-950/60 dark:border-brand-gold-900/20 shadow-xl flex flex-col items-center justify-center text-center p-4 transition-colors duration-300 backdrop-blur-sm z-10"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-sandalwood-900 to-brand-gold-900 flex items-center justify-center text-brand-cream-100 mb-2 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-wide">
                100% Authentic
              </h4>
              <p className="text-[9px] text-brand-charcoal-500 dark:text-brand-cream-300 font-semibold leading-none mt-1">
                Heritage Supply Chain
              </p>
              <div className="mt-2 text-[8px] text-brand-gold-900 font-extrabold uppercase tracking-widest border border-brand-gold-900/30 px-2 py-0.5 rounded bg-brand-gold-900/5">
                ISO Certified B2B
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM: DELIVERY TRUCK PATHWAY */}
        <div className="relative mt-16 w-full h-10 border-b border-brand-sandalwood-500/15 dark:border-brand-gold-900/15 overflow-hidden">
          <motion.div
            initial={{ x: '-150px' }}
            animate={{ x: '100vw' }}
            transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
            className="absolute bottom-0 flex items-center gap-2 pb-0.5 text-brand-sandalwood-800 dark:text-brand-gold-900"
          >
            <Truck className="w-6 h-6 text-brand-sandalwood-500 dark:text-brand-gold-600" />
            <span className="text-[8px] font-bold uppercase tracking-widest whitespace-nowrap text-brand-sandalwood-900 dark:text-brand-gold-400">
              KK EXPRESS &bull; NEXT-DAY DESPATCH SECURED &bull; ₹0 DELIVERY OVER ₹500 &bull; HERITAGE INCENSE BRANDED DISTRIBUTOR
            </span>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
