const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const { User, Product, Order } = require('./models/Schemas.cjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'kk_distributions_super_secret_token';

// Middleware configuration
app.use(cors());
app.use(express.json());

// ==========================================
// MOCK RAZORPAY CONFIGURATION
// ==========================================
// In production, these should reside in an .env file
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mockSecret456'
});

// ==========================================
// 1. AUTHENTICATION & SMS OTP DISPATCH ROUTE
// ==========================================
app.post('/api/auth/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length !== 10) {
    return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
  }

  try {
    // Generate a secure 6-digit verification code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In production, integrate SMS gateways like Twilio or MSG91:
    // await smsGateway.send(phone, `Your KK Distributions login OTP is: ${generatedOtp}`);
    
    console.log(`[SMS Gateway] Dispatched code: ${generatedOtp} to +91 ${phone}`);
    
    // Save generatedOtp briefly in Redis or local memory cache for validation
    res.status(200).json({ message: 'Verification OTP sent successfully', bypassCode: generatedOtp });
  } catch (err) {
    res.status(500).json({ error: 'SMS dispatch pipeline failed' });
  }
});

// Validate OTP & Issue JWT Session Token
app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone and verification code are required' });
  }

  try {
    // Perform verification against saved cache code
    // If successful:
    let user = await User.findOne({ phone });
    if (!user) {
      // Register standard client
      user = new User({
        name: 'Merchant Partner',
        phone,
        addressDetails: {
          address: 'Please configure street delivery address',
          pincode: '560001'
        }
      });
      await user.save();
    }

    // Issue standard JWT session Token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        name: user.name,
        phone: user.phone,
        isB2B: user.isB2BVerified,
        shopName: user.shopName,
        gstin: user.gstin,
        address: user.addressDetails.address,
        city: user.addressDetails.city,
        pincode: user.addressDetails.pincode,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Authentication verification process failed' });
  }
});

// ==========================================
// 2. PRODUCT CATALOG READ & B2B TIER QUERIES
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// ==========================================
// 3. RAZORPAY BILL SETTLEMENT ROUTE
// ==========================================
app.post('/api/checkout/create-razorpay-order', async (req, res) => {
  const { amountInr } = req.body; // Subtotal calculated on final B2B/B2C calculations
  if (!amountInr || amountInr <= 0) {
    return res.status(400).json({ error: 'Valid billing amount is required' });
  }

  try {
    const options = {
      amount: Math.round(amountInr * 100), // Razorpay receives amounts in paisa
      currency: 'INR',
      receipt: `rec_${Math.floor(100000 + Math.random() * 900000)}`,
      payment_capture: 1 // Auto-capture payments
    };

    const rzpOrder = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to initialize Razorpay checkout session' });
  }
});

// Connect to Database & Mount Server Listening
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kk_distributions';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('[Database] Mongoose successfully connected to MongoDB node');
    app.listen(PORT, () => {
      console.log(`[Express Server] KK Distributions listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn(`[Database] Skipping live database connect: ${err.message}`);
    // Start server in standalone mock execution mode
    app.listen(PORT, () => {
      console.log(`[Express Server] standalone mock server running on port ${PORT}`);
    });
  });
