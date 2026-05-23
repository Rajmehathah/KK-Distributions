import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Sun, Moon, Sparkles, LayoutDashboard, Truck, LogOut } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { cartItems, setDrawerOpen } = useCartStore();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-brand-orange-100/10 bg-brand-cream-100/80 dark:bg-brand-charcoal-900/85 dark:border-brand-gold-900/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 shadow-md shadow-brand-orange-500/20 group-hover:scale-105 transition-all duration-300">
            <Truck className="w-6 h-6 text-brand-cream-100" />
            <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-none text-brand-charcoal-900 dark:text-brand-cream-50">
              KK <span className="text-brand-orange-900 dark:text-brand-gold-900">DISTRIBUTIONS</span>
            </h1>
            <p className="text-[10px] tracking-widest text-brand-charcoal-500 dark:text-brand-cream-300 font-semibold uppercase mt-0.5">
              Premium B2B & B2C FMCG
            </p>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              isActive('/')
                ? 'text-brand-orange-900 dark:text-brand-gold-900'
                : 'text-brand-charcoal-600 dark:text-brand-cream-300 hover:text-brand-orange-900 dark:hover:text-brand-gold-900'
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              isActive('/products')
                ? 'text-brand-orange-900 dark:text-brand-gold-900'
                : 'text-brand-charcoal-600 dark:text-brand-cream-300 hover:text-brand-orange-900 dark:hover:text-brand-gold-900'
            }`}
          >
            Explore Catalog
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1.5 ${
                isActive('/admin')
                  ? 'text-brand-orange-900 dark:text-brand-gold-900'
                  : 'text-brand-charcoal-600 dark:text-brand-cream-300 hover:text-brand-orange-900 dark:hover:text-brand-gold-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* WHOLESALE B2B STATUS BADGE */}
          {user?.isB2B && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-gold-900/30 bg-brand-gold-900/10 text-brand-gold-900 text-xs font-bold uppercase tracking-wider animate-pulse-glow">
              <Sparkles className="w-3.5 h-3.5 fill-brand-gold-900" />
              <span>B2B Merchant Active</span>
            </div>
          )}

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-brand-orange-100/10 hover:bg-black/5 dark:hover:bg-white/5 text-brand-charcoal-700 dark:text-brand-cream-300 transition-colors"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-brand-gold-900" />}
          </button>

          {/* CART BUTTON */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative p-2.5 rounded-xl border border-brand-orange-100/10 hover:bg-black/5 dark:hover:bg-white/5 text-brand-charcoal-700 dark:text-brand-cream-300 transition-colors"
            title="Open cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full bg-brand-orange-900 text-brand-cream-100 text-[10px] font-bold shadow-md shadow-brand-orange-900/20 animate-bounce">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* AUTHENTICATION SESSION TRIGGER */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-orange-900/10 to-brand-gold-900/10 border border-brand-orange-900/20 dark:border-brand-gold-900/20">
                <span className="text-sm font-bold text-brand-orange-900 dark:text-brand-gold-900 uppercase">
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <button
                onClick={logout}
                className="hidden sm:flex items-center justify-center p-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 hover:shadow-lg hover:shadow-brand-orange-900/15 text-sm font-bold text-brand-cream-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};
export default Navbar;
