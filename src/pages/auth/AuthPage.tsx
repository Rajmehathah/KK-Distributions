import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Truck, ShieldCheck, ShoppingBag, ArrowRight, Mail, Compass } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../store/toastStore';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, sendOtp, verifyOtp, loginWithEmail, registerB2B, otpSent, isLoading } = useAuthStore();

  // Mode state: 'email' | 'otp' | 'register'
  const [authMode, setAuthMode] = useState<'email' | 'otp' | 'register'>('email');

  // Email form
  const [email, setEmail] = useState('demo@kkdistributions.com');
  const [password, setPassword] = useState('123456');

  // OTP form
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  // Registration Form
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [city] = useState('Bengaluru');
  const [pincode, setPincode] = useState('');

  const redirectPath = searchParams.get('redirect') || '/';

  // Redirect if user session already authenticated
  useEffect(() => {
    if (user) {
      navigate(redirectPath);
    }
  }, [user, navigate, redirectPath]);

  const handleEmailLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in email and password credentials.', 'warning');
      return;
    }

    try {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        showToast(res.message, 'success');
        navigate(redirectPath);
      } else {
        showToast(res.message, 'error');
      }
    } catch {
      showToast('Authentication failed. Try again.', 'error');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length !== 10) {
      showToast('Please enter a valid 10-digit Indian phone number.', 'warning');
      return;
    }

    try {
      const res = await sendOtp(phone);
      if (res.success) {
        showToast(`Verification code sent! [TEST BYPASS: Enter code "123456" for retail or "777777" for B2B wholesale mode]`, 'info', 6000);
      }
    } catch {
      showToast('Failed to dispatch verification code. Try again.', 'error');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      showToast('Please enter a 6-digit OTP code.', 'warning');
      return;
    }

    try {
      const res = await verifyOtp(phone, otp);
      if (res.success) {
        showToast(res.message, 'success');
        navigate(redirectPath);
      } else {
        showToast(res.message, 'error');
      }
    } catch {
      showToast('Verification failed. Try again.', 'error');
    }
  };

  const handleRegisterB2BSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !name || !shopName || !gstin || !address || !pincode) {
      showToast('Please fill all required B2B credentials.', 'warning');
      return;
    }
    if (gstin.length !== 15) {
      showToast('Enter a valid 15-digit GSTIN.', 'warning');
      return;
    }

    try {
      const res = await registerB2B({
        name,
        phone,
        shopName,
        gstin,
        address,
        city,
        pincode,
      });

      if (res.success) {
        showToast('B2B Wholesale account registered successfully!', 'success');
        navigate(redirectPath);
      }
    } catch {
      showToast('B2B registration failed.', 'error');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-brand-cream-50 dark:bg-brand-charcoal-900 transition-colors duration-300">
      
      {/* LEFT COLUMN: CINEMATIC SANDALWOOD BRANDING PANEL */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-brand-sandalwood-900 via-brand-sandalwood-800 to-brand-charcoal-950 text-brand-cream-100 flex-col justify-between p-12 relative overflow-hidden">
        
        {/* LIGHTING & SACRED WATERMARK GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.12),transparent)] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-brand-gold-900/5 blur-[80px]" />

        <div className="space-y-2 relative z-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-sandalwood-600 to-brand-gold-900 shadow-lg border border-brand-gold-900/20">
              <Compass className="w-6 h-6 text-brand-cream-50" />
            </div>
            <div>
              <span className="text-lg font-black uppercase tracking-wider block leading-none">
                KK <span className="text-brand-gold-900">Distributions</span>
              </span>
              <span className="text-[9px] tracking-widest text-brand-cream-300 uppercase font-bold mt-1 block">
                Incense & FMCG Supply
              </span>
            </div>
          </Link>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-gold-900/30 bg-brand-gold-900/10 text-brand-gold-900 text-xs font-bold uppercase tracking-widest">
            <SparklesIcon className="w-3.5 h-3.5 fill-brand-gold-900" />
            <span>Spiritual FMCG Pioneers</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight uppercase leading-[1.25]">
            Procure Premium <span className="text-brand-gold-900">Agarbathi & Dhoop</span> Direct From Source
          </h2>
          <p className="text-xs text-brand-cream-300 font-semibold leading-relaxed">
            KK Distributions digitizes direct factory stock orders for thousands of groceries and puja store owners across South India. Unlock B2B wholesale prices, credit settlement periods, and express delivery in 24 hours.
          </p>
          <div className="space-y-4 pt-2 text-[11px] font-bold uppercase tracking-wider text-brand-cream-200">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold-900">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <span>Sandalwood & Temple Incense direct rates</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold-900">
                <Truck className="w-4.5 h-4.5" />
              </div>
              <span>Next-morning direct store transport dispatch</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold-900">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
              <span>GST compliant e-ledger files & B2B claims</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-brand-cream-400 font-extrabold uppercase tracking-wider relative z-10">
          &copy; KK Distributions &bull; Bengaluru Central Hub
        </p>

      </div>

      {/* RIGHT COLUMN: GLASSMORPHIC FORMS HUB */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="absolute top-[10%] left-[10%] w-[150px] h-[150px] rounded-full bg-brand-orange-500/5 blur-[50px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[200px] h-[200px] rounded-full bg-brand-gold-900/5 blur-[70px] pointer-events-none" />

        <div className="w-full max-w-md p-8 rounded-3xl bg-white/70 dark:bg-brand-charcoal-900/80 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-2xl backdrop-blur-xl space-y-6 transition-all duration-300 relative z-10">
          
          {/* LOGO AND MOTTO (MOBILE ONLY) */}
          <div className="lg:hidden flex flex-col items-center mb-2">
            <h1 className="text-xl font-black tracking-tight text-brand-charcoal-900 dark:text-brand-cream-50 uppercase">
              KK <span className="text-brand-gold-900">DISTRIBUTIONS</span>
            </h1>
            <p className="text-[9px] font-bold text-brand-charcoal-400 dark:text-brand-cream-300 uppercase mt-1 tracking-widest">
              Premium Incense Distributors
            </p>
          </div>

          {/* TAB MODE CONTROLLERS */}
          <div className="flex border-b border-brand-orange-100/10 dark:border-brand-gold-900/10">
            <button
              onClick={() => setAuthMode('email')}
              className={`flex-grow pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                authMode === 'email'
                  ? 'border-b-2 border-brand-sandalwood-500 text-brand-sandalwood-700 dark:text-brand-gold-900'
                  : 'text-brand-charcoal-400 hover:text-brand-charcoal-700 dark:hover:text-brand-cream-200'
              }`}
            >
              Demo Credentials
            </button>
            <button
              onClick={() => setAuthMode('otp')}
              className={`flex-grow pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                authMode === 'otp'
                  ? 'border-b-2 border-brand-sandalwood-500 text-brand-sandalwood-700 dark:text-brand-gold-900'
                  : 'text-brand-charcoal-400 hover:text-brand-charcoal-700 dark:hover:text-brand-cream-200'
              }`}
            >
              Quick OTP Login
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-grow pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                authMode === 'register'
                  ? 'border-b-2 border-brand-sandalwood-500 text-brand-sandalwood-700 dark:text-brand-gold-900'
                  : 'text-brand-charcoal-400 hover:text-brand-charcoal-700 dark:hover:text-brand-cream-200'
              }`}
            >
              Sign Up B2B
            </button>
          </div>

          {/* 1. DEMO EMAIL & PASSWORD FORM */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
              <p className="text-[11px] text-brand-charcoal-550 dark:text-brand-cream-300 leading-relaxed font-semibold">
                To explore direct B2B pricing brackets and protected checkout immediately, please authenticate using our verified partner credentials.
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
                  Merchant Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs font-semibold rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-100/30 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:border-brand-sandalwood-500 dark:focus:border-brand-gold-900 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
                  Secure Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs font-semibold rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-100/30 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:border-brand-sandalwood-500 dark:focus:border-brand-gold-900 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-tr from-brand-sandalwood-700 to-brand-gold-900 hover:from-brand-sandalwood-800 hover:to-brand-gold-800 text-brand-cream-50 text-xs font-bold uppercase tracking-widest hover:shadow-xl transition-all shadow-md shadow-brand-sandalwood-900/10 cursor-pointer"
              >
                <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate Partner Session'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 rounded-xl border border-brand-gold-900/20 bg-brand-gold-900/5 text-[10px] text-brand-charcoal-600 dark:text-brand-cream-300 leading-normal font-semibold">
                🔑 **Pre-configured Test Account**:
                <br />
                Email: <span className="font-extrabold text-brand-sandalwood-750 dark:text-brand-gold-900">demo@kkdistributions.com</span>
                <br />
                Password: <span className="font-extrabold text-brand-sandalwood-750 dark:text-brand-gold-900">123456</span>
              </div>
            </form>
          )}

          {/* 2. OTP QUICK MOBILE FLOW */}
          {authMode === 'otp' && (
            <div className="space-y-4">
              <p className="text-[11px] text-brand-charcoal-550 dark:text-brand-cream-300 leading-relaxed font-semibold">
                Verify your cell number via instant OTP SMS channels. To test standard profile, submit bypass **"123456"**. Enter **"777777"** for verified B2B wholesaler status!
              </p>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
                      10-Digit Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-charcoal-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="98450 XXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-12 pr-4 py-3 text-xs font-semibold rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-100/30 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:border-brand-sandalwood-500 dark:focus:border-brand-gold-900 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-tr from-brand-sandalwood-700 to-brand-gold-900 text-brand-cream-50 text-xs font-bold uppercase tracking-widest hover:shadow-lg transition-all"
                  >
                    <span>{isLoading ? 'Requesting code...' : 'Generate OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
                      6-Digit Security OTP
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal-400" />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="XXXXXX"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-10 pr-4 py-3 text-xs font-semibold rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-100/30 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:border-brand-sandalwood-500 dark:focus:border-brand-gold-900 transition-colors text-center tracking-[8px] font-extrabold text-sm"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-tr from-brand-sandalwood-700 to-brand-gold-900 text-brand-cream-50 text-xs font-bold uppercase tracking-widest hover:shadow-lg transition-all"
                  >
                    <span>{isLoading ? 'Verifying OTP...' : 'Submit Verification Code'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 3. FULL B2B SIGN UP FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterB2BSubmit} className="space-y-4 overflow-y-auto max-h-[380px] pr-2 no-scrollbar">
              <p className="text-[11px] text-brand-charcoal-550 dark:text-brand-cream-300 leading-relaxed font-semibold">
                Sign up as a verified wholesale distribution partner. Access tax bills and premium factory discounts.
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
                  Proprietor Full Name
                </label>
                <input
                  type="text"
                  placeholder="E.g., Ramesh K."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-100/30 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:border-brand-sandalwood-500 dark:focus:border-brand-gold-900 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
                  Store / Shop Trade Title
                </label>
                <input
                  type="text"
                  placeholder="E.g., Sri Manjunatha Stores"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-100/30 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:border-brand-sandalwood-500 dark:focus:border-brand-gold-900 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
                  15-Digit GSTIN ID
                </label>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="E.g., 29AAAAA0000A1Z5"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-100/30 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:border-brand-sandalwood-500 dark:focus:border-brand-gold-900 transition-colors uppercase font-bold tracking-wider"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
                  Merchant Contact Number
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="E.g., 98450 XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-100/30 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:border-brand-sandalwood-500 dark:focus:border-brand-gold-900 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
                  Delivery Site Address
                </label>
                <input
                  type="text"
                  placeholder="Road name, building number"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-100/30 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:border-brand-sandalwood-500 dark:focus:border-brand-gold-900 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
                    City Hub
                  </label>
                  <input
                    type="text"
                    value={city}
                    disabled
                    className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-200 dark:bg-brand-charcoal-950 text-brand-charcoal-500 dark:text-brand-cream-400 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-charcoal-500 dark:text-brand-cream-300 uppercase tracking-widest">
                    Pincode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="560022"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-100/30 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:border-brand-sandalwood-500 dark:focus:border-brand-gold-900 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-tr from-brand-sandalwood-700 to-brand-gold-900 text-brand-cream-50 text-xs font-bold uppercase tracking-widest hover:shadow-lg transition-all"
              >
                <span>{isLoading ? 'Verifying Merchant...' : 'Create B2B Merchant Profile'}</span>
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
};

// Reusable SVG Icon to avoid Radix dependency issues
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z" />
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
  </svg>
);

export default AuthPage;
