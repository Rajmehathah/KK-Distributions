import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import type { Product } from '../../data/dummyData';
import { useCartStore } from '../../store/cartStore';
import { showToast } from '../../store/toastStore';

interface CartQuantitySelectorProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CartQuantitySelector: React.FC<CartQuantitySelectorProps> = ({
  product,
  className = '',
  size = 'md'
}) => {
  const { cartItems, addItem, updateQuantity, removeItem } = useCartStore();

  const currentItem = cartItems.find((item) => item.product.id === product.id);
  const quantity = currentItem ? currentItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    showToast(`Added ${product.name} to basket.`, 'success');
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity <= 1) {
      removeItem(product.id);
      showToast(`Removed ${product.name} from basket.`, 'info');
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  // Curate sizes
  const sizeClasses = {
    sm: {
      btn: 'px-2 py-1 text-[9px] rounded-lg',
      pill: 'h-7 px-1 text-xs gap-1.5 rounded-lg',
      icon: 'w-3 h-3',
      num: 'min-w-[12px] text-[10px]'
    },
    md: {
      btn: 'px-4 py-2 text-xs rounded-xl',
      pill: 'h-9 px-2 text-xs gap-2.5 rounded-xl',
      icon: 'w-3.5 h-3.5',
      num: 'min-w-[16px] text-xs'
    },
    lg: {
      btn: 'px-6 py-3 text-xs rounded-2xl',
      pill: 'h-11 px-3 text-sm gap-3.5 rounded-2xl',
      icon: 'w-4 h-4',
      num: 'min-w-[20px] text-sm'
    }
  }[size];

  return (
    <div className={`relative flex items-center justify-center font-bold uppercase tracking-wider ${className}`}>
      <AnimatePresence mode="wait">
        {quantity === 0 ? (
          
          /* morphing ADD trigger button */
          <motion.button
            key="add-btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className={`${sizeClasses.btn} bg-gradient-to-tr from-brand-sandalwood-700 to-brand-gold-900 text-brand-cream-50 hover:from-brand-sandalwood-800 hover:to-brand-gold-800 border border-brand-gold-900/20 shadow-md shadow-brand-sandalwood-900/10 flex items-center gap-1.5 cursor-pointer w-full justify-center transition-all`}
          >
            <Plus className={sizeClasses.icon} />
            <span>ADD</span>
          </motion.button>
        ) : (
          
          /* pill style control selector */
          <motion.div
            key="qty-pill"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`${sizeClasses.pill} flex items-center justify-between border-2 border-brand-sandalwood-500 bg-brand-cream-100 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 shadow-sm w-full`}
          >
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleDecrement}
              className="p-1 rounded-lg text-brand-sandalwood-600 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
            >
              <Minus className={sizeClasses.icon} />
            </motion.button>

            <motion.span
              key={quantity}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`${sizeClasses.num} text-center font-extrabold text-brand-sandalwood-800 dark:text-brand-gold-900`}
            >
              {quantity}
            </motion.span>

            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleIncrement}
              className="p-1 rounded-lg text-brand-sandalwood-600 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
            >
              <Plus className={sizeClasses.icon} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartQuantitySelector;
