import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2, Tag, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../store/toastStore';
import CartQuantitySelector from './CartQuantitySelector';
import OptimizedImage from './OptimizedImage';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { isDrawerOpen, setDrawerOpen, cartItems, removeItem, appliedCoupon, applyCoupon, removeCoupon, getCalculations } = useCartStore();
  const { user } = useAuthStore();
  
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const isB2B = user?.isB2B || false;
  const calcs = getCalculations(isB2B);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    
    setIsApplying(true);
    setTimeout(() => {
      const res = applyCoupon(couponInput);
      setIsApplying(false);
      if (res.success) {
        showToast(res.message, 'success');
        setCouponInput('');
      } else {
        showToast(res.message, 'error');
      }
    }, 600);
  };

  const handleCheckoutRedirect = () => {
    setDrawerOpen(false);
    if (!user) {
      showToast('Please login to place your order.', 'info');
      navigate('/auth?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* BACKDROP OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* DRAWER PANEL */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md h-full bg-brand-cream-50 dark:bg-brand-charcoal-900 border-l border-brand-orange-100/10 dark:border-brand-gold-900/10 shadow-2xl flex flex-col transition-colors duration-300"
          >
            {/* DRAWER HEADER */}
            <div className="p-6 border-b border-brand-orange-100/10 dark:border-brand-gold-900/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-orange-900 dark:text-brand-gold-900" />
                <span className="text-lg font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-wide">
                  Your Basket
                </span>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-brand-orange-900/10 text-brand-orange-900 dark:bg-brand-gold-900/10 dark:text-brand-gold-900">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-brand-charcoal-500 dark:text-brand-cream-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DRAWER CONTENT */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-brand-cream-200 dark:bg-brand-charcoal-800 flex items-center justify-center text-brand-charcoal-400 dark:text-brand-cream-300">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="text-md font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-wide">
                    Cart is Empty
                  </h3>
                  <p className="text-xs text-brand-charcoal-500 dark:text-brand-cream-300 max-w-[240px]">
                    Looks like you haven't added anything to your order yet. Start browsing to place order!
                  </p>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate('/products');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 text-brand-cream-100 text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all duration-300"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const p = item.product;
                    const qualifiesB2B = isB2B || item.quantity >= p.minB2bQty;
                    const finalUnitPrice = qualifiesB2B ? p.b2bPrice : p.price;
                    const isB2BTriggered = item.quantity >= p.minB2bQty && !isB2B;

                    return (
                      <motion.div
                        key={p.id}
                        layout
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-brand-charcoal-950 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm"
                      >
                        {/* PRODUCT BADGE */}
                        <div className="w-14 h-14 rounded-xl flex-shrink-0 relative overflow-hidden shadow-inner">
                          <OptimizedImage
                            productId={p.id}
                            category={p.category}
                            alt={p.name}
                            className="w-full h-full"
                          />
                        </div>

                        {/* PRODUCT INFO */}
                        <div className="flex-grow space-y-1">
                          <h4 className="text-xs font-bold text-brand-charcoal-900 dark:text-brand-cream-50 line-clamp-1">
                            {p.name}
                          </h4>
                          <p className="text-[10px] text-brand-charcoal-500 dark:text-brand-cream-300 font-semibold">
                            {p.unit} &bull; GST {p.gstRate}%
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-brand-charcoal-950 dark:text-brand-cream-50">
                              ₹{finalUnitPrice * item.quantity}
                            </span>
                            {qualifiesB2B && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-brand-gold-900/10 text-brand-gold-900 font-bold uppercase">
                                Wholesale Price
                              </span>
                            )}
                          </div>
                          {isB2BTriggered && (
                            <p className="text-[8px] font-bold text-brand-gold-900">
                              Bulk Qty Activated B2B Rate!
                            </p>
                          )}
                        </div>

                        {/* QUANTITY ADJUSTER */}
                        <div className="flex flex-col items-end justify-between gap-3">
                          <button
                            onClick={() => removeItem(p.id)}
                            className="p-1 rounded-lg text-brand-charcoal-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="w-[85px]">
                            <CartQuantitySelector product={p} size="sm" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* DRAWER FOOTER (CHECKOUT INVOICE PANEL) */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-brand-orange-100/10 dark:border-brand-gold-900/10 bg-white dark:bg-brand-charcoal-950 space-y-4">
                
                {/* COUPON INPUT */}
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-brand-gold-900/20 bg-brand-gold-900/5 text-xs text-brand-gold-900 font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-brand-gold-900" />
                      <span>{appliedCoupon.code} Applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[10px] text-red-500 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-grow">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal-400" />
                      <input
                        type="text"
                        placeholder="ENTER COUPON CODE"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold uppercase rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-100 dark:bg-brand-charcoal-900 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:border-brand-orange-900 dark:focus:border-brand-gold-900 transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-4 py-2.5 rounded-xl bg-brand-charcoal-900 dark:bg-brand-charcoal-800 text-brand-cream-100 text-xs font-bold hover:bg-brand-orange-900 dark:hover:bg-brand-gold-900 transition-colors flex-shrink-0 disabled:opacity-50"
                    >
                      {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                  </form>
                )}

                {/* INVOICE PRICING */}
                <div className="space-y-2.5 text-xs font-medium text-brand-charcoal-600 dark:text-brand-cream-300">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-brand-charcoal-900 dark:text-brand-cream-50">
                      ₹{calcs.subtotal}
                    </span>
                  </div>
                  {calcs.b2bDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-500">
                      <span>B2B Wholesale Savings</span>
                      <span className="font-bold">-₹{calcs.b2bDiscount}</span>
                    </div>
                  )}
                  {calcs.couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-500">
                      <span>Promo Coupon Discount</span>
                      <span className="font-bold">-₹{calcs.couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (Tax Amount)</span>
                    <span className="font-bold text-brand-charcoal-900 dark:text-brand-cream-50">
                      ₹{calcs.gstAmount.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="font-bold text-brand-charcoal-900 dark:text-brand-cream-50">
                      {calcs.deliveryCharge === 0 ? 'FREE' : `₹${calcs.deliveryCharge}`}
                    </span>
                  </div>
                  <div className="border-t border-brand-orange-100/10 dark:border-brand-gold-900/10 pt-3 flex justify-between text-sm font-bold text-brand-charcoal-900 dark:text-brand-cream-50">
                    <span className="uppercase tracking-wider">Net Amount</span>
                    <span className="text-brand-orange-900 dark:text-brand-gold-900 text-lg">
                      ₹{calcs.total.toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* CHECKOUT BUTTON */}
                <button
                  onClick={handleCheckoutRedirect}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 hover:shadow-xl hover:shadow-brand-orange-900/20 text-sm font-bold text-brand-cream-100 uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <span>Proceed to Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default CartDrawer;
