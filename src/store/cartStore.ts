import { create } from 'zustand';
import { AVAILABLE_COUPONS } from '../data/dummyData';
import type { Product, Coupon } from '../data/dummyData';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  isDrawerOpen: boolean;
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  
  // Calculations
  getCalculations: (isB2BUser: boolean) => {
    subtotal: number;
    b2bDiscount: number;
    gstAmount: number;
    deliveryCharge: number;
    couponDiscount: number;
    total: number;
  };
}

// Helper to save to localStorage
const saveCartToStorage = (items: CartItem[], coupon: Coupon | null) => {
  localStorage.setItem('cart_items', JSON.stringify(items));
  localStorage.setItem('cart_coupon', JSON.stringify(coupon));
};

// Helper to load from localStorage
const loadCartItems = (): CartItem[] => {
  const data = localStorage.getItem('cart_items');
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const loadCoupon = (): Coupon | null => {
  const data = localStorage.getItem('cart_coupon');
  try {
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: loadCartItems(),
  appliedCoupon: loadCoupon(),
  isDrawerOpen: false,

  addItem: (product: Product, quantity = 1) => {
    set((state) => {
      const existingItem = state.cartItems.find((item) => item.product.id === product.id);
      let newItems;
      if (existingItem) {
        newItems = state.cartItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.cartItems, { product, quantity }];
      }
      saveCartToStorage(newItems, state.appliedCoupon);
      return { cartItems: newItems };
    });
  },

  removeItem: (productId: string) => {
    set((state) => {
      const newItems = state.cartItems.filter((item) => item.product.id !== productId);
      saveCartToStorage(newItems, state.appliedCoupon);
      return { cartItems: newItems };
    });
  },

  updateQuantity: (productId: string, quantity: number) => {
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.cartItems.filter((item) => item.product.id !== productId);
        saveCartToStorage(newItems, state.appliedCoupon);
        return { cartItems: newItems };
      }
      const newItems = state.cartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCartToStorage(newItems, state.appliedCoupon);
      return { cartItems: newItems };
    });
  },

  clearCart: () => {
    set(() => {
      saveCartToStorage([], null);
      return { cartItems: [], appliedCoupon: null };
    });
  },

  applyCoupon: (code: string) => {
    const coupon = AVAILABLE_COUPONS.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code.' };
    }

    const { subtotal } = get().getCalculations(false); // Quick baseline
    if (subtotal < coupon.minSubtotal) {
      return {
        success: false,
        message: `Min order value to apply coupon is ₹${coupon.minSubtotal}.`,
      };
    }

    set({ appliedCoupon: coupon });
    saveCartToStorage(get().cartItems, coupon);
    return { success: true, message: `Coupon applied successfully! You saved ${coupon.discountPercentage}%.` };
  },

  removeCoupon: () => {
    set({ appliedCoupon: null });
    saveCartToStorage(get().cartItems, null);
  },

  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),

  getCalculations: (isB2BUser: boolean) => {
    const { cartItems, appliedCoupon } = get();

    let subtotal = 0;
    let b2bDiscount = 0;
    let gstAmount = 0;

    cartItems.forEach((item) => {
      const product = item.product;
      const quantity = item.quantity;
      
      // Determine if B2B wholesale pricing should apply to this item
      // Condition: either the global user state is B2B, OR the retail customer ordered more than minB2bQty
      const qualifiesForB2B = isB2BUser || quantity >= product.minB2bQty;
      const unitPrice = qualifiesForB2B ? product.b2bPrice : product.price;

      const itemTotalRaw = product.price * quantity;
      const itemTotalActual = unitPrice * quantity;

      subtotal += itemTotalActual;
      if (qualifiesForB2B) {
        b2bDiscount += (itemTotalRaw - itemTotalActual);
      }

      // GST Calculation: GST is typically calculated on the final taxable unit price
      const itemGst = itemTotalActual * (product.gstRate / 100);
      gstAmount += itemGst;
    });

    // Coupon discount applies to the subtotal (after B2B discounts have been integrated)
    let couponDiscount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minSubtotal) {
      couponDiscount = subtotal * (appliedCoupon.discountPercentage / 100);
    }

    // Delivery charges: Free delivery if net subtotal (after coupon) is above ₹500
    const netSubtotal = subtotal - couponDiscount;
    const deliveryCharge = netSubtotal > 500 || cartItems.length === 0 ? 0 : 40;

    const total = netSubtotal + gstAmount + deliveryCharge;

    return {
      subtotal,
      b2bDiscount,
      gstAmount,
      deliveryCharge,
      couponDiscount,
      total,
    };
  },
}));
