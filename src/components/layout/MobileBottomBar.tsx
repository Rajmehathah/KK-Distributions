import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export const MobileBottomBar: React.FC = () => {
  const location = useLocation();
  const { cartItems, setDrawerOpen } = useCartStore();
  const { user } = useAuthStore();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const currentPath = location.pathname;

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDrawerOpen(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-brand-charcoal-900/90 backdrop-blur-lg border-t border-brand-sandalwood-500/10 dark:border-brand-gold-900/10 h-16 md:hidden px-4 flex items-center justify-around shadow-[0_-4px_24px_rgba(0,0,0,0.04)] select-none">
      
      {/* HOME LINK */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors duration-300 ${
          currentPath === '/' 
            ? 'text-brand-sandalwood-700 dark:text-brand-gold-900' 
            : 'text-brand-charcoal-400 dark:text-brand-cream-300/60 hover:text-brand-sandalwood-500'
        }`}
      >
        <Home className={`w-5 h-5 transition-transform duration-300 ${currentPath === '/' ? 'scale-110' : ''}`} />
        <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
      </Link>

      {/* CATALOG / PRODUCTS LINK */}
      <Link
        to="/products"
        className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors duration-300 ${
          currentPath === '/products' 
            ? 'text-brand-sandalwood-700 dark:text-brand-gold-900' 
            : 'text-brand-charcoal-400 dark:text-brand-cream-300/60 hover:text-brand-sandalwood-500'
        }`}
      >
        <ShoppingBag className={`w-5 h-5 transition-transform duration-300 ${currentPath === '/products' ? 'scale-110' : ''}`} />
        <span className="text-[10px] font-bold uppercase tracking-wider">Products</span>
      </Link>

      {/* DYNAMIC CART TRIGGER */}
      <button
        onClick={handleCartClick}
        className="flex flex-col items-center justify-center flex-1 h-full gap-1 relative text-brand-charcoal-400 dark:text-brand-cream-300/60 hover:text-brand-sandalwood-500 transition-colors duration-300 cursor-pointer"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-brand-gold-900 text-brand-cream-50 font-extrabold text-[8px] border border-white dark:border-brand-charcoal-900 animate-pulse">
              {totalItems}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">Cart</span>
      </button>

      {/* ACCOUNT / PROFILE LINK */}
      <Link
        to="/auth"
        className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors duration-300 ${
          currentPath === '/auth' 
            ? 'text-brand-sandalwood-700 dark:text-brand-gold-900' 
            : 'text-brand-charcoal-400 dark:text-brand-cream-300/60 hover:text-brand-sandalwood-500'
        }`}
      >
        {user?.role === 'admin' ? (
          <ShieldCheck className={`w-5 h-5 text-brand-gold-900 transition-transform duration-300 ${currentPath === '/auth' ? 'scale-110' : ''}`} />
        ) : (
          <User className={`w-5 h-5 transition-transform duration-300 ${currentPath === '/auth' ? 'scale-110' : ''}`} />
        )}
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {user ? (user.role === 'admin' ? 'Admin' : 'Account') : 'Login'}
        </span>
      </Link>

    </div>
  );
};

export default MobileBottomBar;
