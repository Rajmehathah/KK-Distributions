import React from 'react';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import CategoryCarousel from './CategoryCarousel';
import { Quote, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: 'Ramesh K. (Sri Manjunatha Stores)',
      role: 'Wholesale Grocer, Yeshwanthpur',
      quote: "KK Distributions has changed how we stock our store! No more waiting for sales agents to write orders manually on paper. I order sandalkot agarbathi and butter cookies at night, and by 9 AM next morning, the truck is at my shop. Invoicing is 100% clear.",
      initials: 'RK',
    },
    {
      name: 'Sunita Gowda (Aura Supermart)',
      role: 'Supermarket Owner, Indiranagar',
      quote: "Being a GST-registered merchant, getting automatic B2B tax bills directly to my email is extremely helpful. The bulk pricing brackets are outstanding—buying in wholesale cases has cut our procurement costs by 14%!",
      initials: 'SG',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-cream-50 dark:bg-brand-charcoal-900 transition-colors duration-300">
      
      {/* 1. HERO GRAPHICS SECTION */}
      <HeroSection />

      {/* 2. CORE ABOUT & STATS NETWORK */}
      <AboutSection />

      {/* 3. PRODUCT SHOWCASE CAROUSEL */}
      <CategoryCarousel />

      {/* 4. PREMIUM RETAILER TESTIMONIALS */}
      <section className="py-20 bg-brand-cream-100 dark:bg-brand-charcoal-950/40 border-t border-brand-orange-100/5 dark:border-brand-gold-900/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange-900 dark:text-brand-gold-900">
              <HeartHandshake className="w-4 h-4" />
              <span>Partner Testimonials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase">
              What Our Store Partners Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <Quote className="absolute right-6 top-6 w-12 h-12 text-brand-orange-500/10 pointer-events-none" />
                <p className="text-xs sm:text-sm text-brand-charcoal-600 dark:text-brand-cream-300 leading-relaxed italic font-medium">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-brand-orange-100/5 dark:border-brand-gold-900/5">
                  <div className="w-10 h-10 rounded-xl bg-brand-orange-950/10 dark:bg-brand-gold-900/10 flex items-center justify-center text-brand-orange-900 dark:text-brand-gold-900 font-extrabold text-xs">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-brand-charcoal-400 dark:text-brand-cream-300 font-semibold uppercase tracking-wider">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. QUICK MERCHANT CTA CALLOUT */}
      <section className="py-16 bg-gradient-to-tr from-brand-orange-950 to-brand-charcoal-950 border-t border-brand-gold-900/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,179,0,0.08),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-brand-cream-100 uppercase tracking-tight">
            Are You A Registered FMCG Store Owner?
          </h2>
          <p className="text-xs sm:text-sm text-brand-cream-300 max-w-xl mx-auto font-semibold">
            Register your wholesale GSTIN today to instantly unlock verified merchant status, factory bulk pricing, and deferred payment terms.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 hover:shadow-lg text-xs font-bold text-brand-cream-100 uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Register B2B Account</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/products')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-brand-cream-100/20 bg-white/5 hover:bg-white/10 text-xs font-bold text-brand-cream-100 uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
export default LandingPage;
