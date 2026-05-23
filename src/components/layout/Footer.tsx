import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-charcoal-950 text-brand-cream-200 border-t border-brand-gold-900/10 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* COLUMN 1: BRAND SUMMARY */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 shadow-md">
                <Truck className="w-5.5 h-5.5 text-brand-cream-100" />
              </div>
              <span className="text-lg font-bold text-brand-cream-50 uppercase tracking-wide">
                KK <span className="text-brand-orange-500">Distributions</span>
              </span>
            </Link>
            <p className="text-xs text-brand-cream-400 leading-relaxed font-medium">
              Simplifying premium Indian FMCG distribution. Bridging traditional retail trust with next-gen speed, delivering daily essentials within 24 hours.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-brand-gold-900 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-brand-gold-900" />
              <span>Trusted by 500+ Shops</span>
            </div>
          </div>

          {/* COLUMN 2: QUICK CHANNELS */}
          <div>
            <h3 className="text-sm font-bold text-brand-cream-50 uppercase tracking-widest mb-6">
              Product Categories
            </h3>
            <ul className="space-y-3.5 text-xs font-semibold text-brand-cream-400">
              <li>
                <Link to="/products" className="hover:text-brand-orange-500 transition-colors">
                  Agarbathis & Dhoop
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-brand-orange-500 transition-colors">
                  Cookies & Biscuits
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-brand-orange-500 transition-colors">
                  Mixtures & Snacks
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-brand-orange-500 transition-colors">
                  Daily Grocery & Atta
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: B2B RELIABILITY */}
          <div>
            <h3 className="text-sm font-bold text-brand-cream-50 uppercase tracking-widest mb-6">
              Merchant Partnerships
            </h3>
            <ul className="space-y-3.5 text-xs font-semibold text-brand-cream-400">
              <li>
                <Link to="/auth" className="hover:text-brand-orange-500 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-gold-900" />
                  Register wholesale GSTIN
                </Link>
              </li>
              <li>
                <span className="hover:text-brand-orange-500 transition-colors block cursor-help" title="Minimum ₹2000 basket value">
                  Wholesale Bulk Discounts
                </span>
              </li>
              <li>
                <span className="hover:text-brand-orange-500 transition-colors block">
                  Next-Day Direct Store Delivery
                </span>
              </li>
              <li>
                <span className="hover:text-brand-orange-500 transition-colors block">
                  Digital Ledger & Invoicing
                </span>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: COMPANY INFO */}
          <div>
            <h3 className="text-sm font-bold text-brand-cream-50 uppercase tracking-widest mb-6">
              Headquarters
            </h3>
            <ul className="space-y-3.5 text-xs font-medium text-brand-cream-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-orange-500 mt-0.5 flex-shrink-0" />
                <span>
                  Plot 14-B, Yeshwanthpur Industrial Area Phase 2, Yeshwanthpur, Bengaluru, KA - 560022
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-orange-500 flex-shrink-0" />
                <span>+91 98450 12345 / 080 2345 6789</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange-500 flex-shrink-0" />
                <span>support@kkdistributions.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t border-brand-cream-100/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-cream-500 font-semibold">
            &copy; {new Date().getFullYear()} KK Distributions. All Rights Reserved. Designed for premium supply chain.
          </p>
          <div className="flex gap-6 text-xs text-brand-cream-500 font-semibold">
            <span className="hover:text-brand-cream-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-brand-cream-300 cursor-pointer">B2B Trade Agreement</span>
            <span className="hover:text-brand-cream-300 cursor-pointer">Refund Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
