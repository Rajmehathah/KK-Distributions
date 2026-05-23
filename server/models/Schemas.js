const mongoose = require('mongoose');

// ==========================================
// 1. USER SCHEMA (RETAIL & WHOLESALE B2B)
// ==========================================
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  // B2B Wholesale Merchant properties
  isB2BVerified: {
    type: Boolean,
    default: false
  },
  shopName: {
    type: String,
    trim: true
  },
  gstin: {
    type: String,
    trim: true,
    uppercase: true,
    minlength: 15,
    maxlength: 15
  },
  addressDetails: {
    address: { type: String, required: true },
    city: { type: String, default: 'Bengaluru' },
    pincode: { type: String, required: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ==========================================
// 2. PRODUCT SCHEMA (FMCG INVENTORIES)
// ==========================================
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['dhoop-agarbathi', 'biscuits', 'mixtures-snacks', 'beverages', 'household-essentials', 'daily-grocery']
  },
  price: {
    type: Number,
    required: true // Retail price per unit (INR)
  },
  b2bPrice: {
    type: Number,
    required: true // Wholesale bulk price per unit (INR)
  },
  minB2bQty: {
    type: Number,
    default: 10 // Minimum order quantity to trigger wholesale rates
  },
  unit: {
    type: String,
    required: true // E.g., "Pack of 12", "1 Kg Bag"
  },
  rating: {
    type: Number,
    default: 4.5
  },
  stock: {
    type: Number,
    required: true,
    default: 500
  },
  description: {
    type: String,
    required: true
  },
  imageGradClass: {
    type: String,
    required: true // CSS gradient representation or static asset path
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  gstRate: {
    type: Number,
    required: true,
    enum: [5, 12, 18] // FMCG standard GST tax percentages
  },
  origin: {
    type: String,
    required: true // E.g., "Mysuru, Karnataka"
  }
});

// ==========================================
// 3. ORDER SCHEMA (B2B TRANSACTIONS)
// ==========================================
const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: { type: Number, required: true },
    purchasedPrice: { type: Number, required: true }, // Locked unit cost
    isWholesaleApplied: { type: Boolean, default: false }
  }],
  calculations: {
    subtotal: { type: Number, required: true },
    b2bDiscount: { type: Number, default: 0 },
    gstAmount: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true }
  },
  appliedCoupon: {
    code: { type: String },
    discountPercentage: { type: Number }
  },
  shippingDetails: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    deliveryInstructions: { type: String }
  },
  payment: {
    method: {
      type: String,
      enum: ['upi', 'card', 'cod'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'pending'
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String }
  },
  status: {
    type: String,
    enum: ['Placed', 'Packing', 'Dispatched', 'Delivered'],
    default: 'Placed'
  },
  dispatchedAt: { type: Date },
  deliveredAt: { type: Date },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Product: mongoose.model('Product', ProductSchema),
  Order: mongoose.model('Order', OrderSchema)
};
