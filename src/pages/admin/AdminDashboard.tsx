import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Truck, 
  Plus, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  FileText, 
  Camera, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../../data/dummyData';
import type { Product } from '../../data/dummyData';
import { showToast } from '../../store/toastStore';
import OptimizedImage from '../../components/common/OptimizedImage';

interface MockOrder {
  id: string;
  storeName: string;
  itemsCount: number;
  totalAmount: number;
  status: 'Placed' | 'Packing' | 'Dispatched' | 'Delivered';
  phone: string;
  time: string;
}

const INITIAL_ORDERS: MockOrder[] = [
  { id: 'KKD-781920', storeName: 'Sri Manjunatha Stores', itemsCount: 14, totalAmount: 4850, status: 'Packing', phone: '98450 12345', time: '10 Mins Ago' },
  { id: 'KKD-190283', storeName: 'Aura Supermart', itemsCount: 45, totalAmount: 18450, status: 'Placed', phone: '97430 98765', time: '1 Hour Ago' },
  { id: 'KKD-827103', storeName: 'Ganesh Provision Stores', itemsCount: 8, totalAmount: 1980, status: 'Dispatched', phone: '99020 55443', time: '3 Hours Ago' },
  { id: 'KKD-381902', storeName: 'Kaveri Mart', itemsCount: 22, totalAmount: 7600, status: 'Delivered', phone: '94480 33211', time: 'Yesterday' },
];

const ANALYTICS_DATA = [
  { month: 'Dec', sales: 480000, orders: 1200 },
  { month: 'Jan', sales: 520000, orders: 1350 },
  { month: 'Feb', sales: 610000, orders: 1520 },
  { month: 'Mar', sales: 590000, orders: 1490 },
  { month: 'Apr', sales: 740000, orders: 1850 },
  { month: 'May', sales: 850000, orders: 2100 },
];

const PIE_COLORS = ['#E65100', '#FFB300', '#FF5722', '#009688', '#3F51B5', '#8BC34A'];

export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<MockOrder[]>(INITIAL_ORDERS);
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products' | 'verifier'>('analytics');

  // Product addition state
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(CATEGORIES[0].id);
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductB2BPrice, setNewProductB2BPrice] = useState('');
  const [newProductMinB2B] = useState('10');
  const [newProductUnit, setNewProductUnit] = useState('Pack of 12');
  const [newProductStock, setNewProductStock] = useState('500');

  // Image Verification Tab States
  const [selectedVerifyProduct, setSelectedVerifyProduct] = useState<Product>(PRODUCTS[0]);
  const [verifiedProducts, setVerifiedProducts] = useState<Record<string, 'approved' | 'rejected' | 'pending'>>({});
  const [activeScrapeChannel, setActiveScrapeChannel] = useState<'IndiaMART' | 'Amazon B2B' | 'Flipkart' | 'Cycle.in'>('IndiaMART');
  const [confidenceScore, setConfidenceScore] = useState<number>(94);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [usePdfCrop, setUsePdfCrop] = useState<boolean>(false);

  // Sync state if productsList changes
  useEffect(() => {
    if (productsList.length > 0) {
      setSelectedVerifyProduct(productsList[0]);
    }
  }, [productsList]);

  // Update confidence scores dynamically as product selection changes to make it look highly authentic
  useEffect(() => {
    const score = 80 + Math.floor(Math.random() * 19);
    setConfidenceScore(score);
    setUsePdfCrop(false);
  }, [selectedVerifyProduct]);

  const handleStatusChange = (orderId: string, newStatus: MockOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order ${orderId} dispatch status updated to ${newStatus}.`, 'success');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !newProductB2BPrice) {
      showToast('Please fill essential product columns.', 'warning');
      return;
    }

    const newProd: Product = {
      id: 'custom-' + Math.floor(1000 + Math.random() * 9000),
      name: newProductName,
      category: newProductCategory,
      price: Number(newProductPrice),
      b2bPrice: Number(newProductB2BPrice),
      minB2bQty: Number(newProductMinB2B),
      unit: newProductUnit,
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(newProductStock),
      description: 'Custom added product by distribution admin. Direct wholesale supply.',
      image: 'bg-gradient-to-tr from-brand-sandalwood-700 to-brand-gold-900',
      isNew: true,
      gstRate: 12,
      origin: 'KK HQ Dispatch Node, Bengaluru',
      deliveryEstimate: 'Tomorrow, by 10 AM',
    };

    setProductsList([newProd, ...productsList]);
    showToast(`Product ${newProductName} successfully registered in ERP database.`, 'success');

    // Reset Form
    setNewProductName('');
    setNewProductPrice('');
    setNewProductB2BPrice('');
  };

  // Simulated Scraping Channel toggle
  const triggerRescrape = () => {
    setIsScraping(true);
    const channels: ('IndiaMART' | 'Amazon B2B' | 'Flipkart' | 'Cycle.in')[] = ['IndiaMART', 'Amazon B2B', 'Flipkart', 'Cycle.in'];
    const nextChannel = channels[(channels.indexOf(activeScrapeChannel) + 1) % channels.length];
    
    setTimeout(() => {
      setActiveScrapeChannel(nextChannel);
      const newScore = 82 + Math.floor(Math.random() * 17);
      setConfidenceScore(newScore);
      setIsScraping(false);
      showToast(`Scraped fresh match from ${nextChannel} with ${newScore}% confidence!`, 'success');
    }, 1200);
  };

  const approveProductImage = (productId: string) => {
    setVerifiedProducts(prev => ({ ...prev, [productId]: 'approved' }));
    showToast(`Packaging image for ${selectedVerifyProduct.name} approved! Synced to eCommerce storefront.`, 'success');
  };

  const rejectProductImage = (productId: string) => {
    setVerifiedProducts(prev => ({ ...prev, [productId]: 'rejected' }));
    setUsePdfCrop(true);
    showToast(`Rejected online package. PDF Crop Fallback extraction triggered successfully.`, 'info');
  };

  // Compile Category splits for Recharts Pie Chart
  const pieData = CATEGORIES.map((cat, idx) => {
    const count = productsList.filter((p) => p.category === cat.id).length;
    return { name: cat.name.split(' ')[0], value: count, color: PIE_COLORS[idx % PIE_COLORS.length] };
  });

  return (
    <div className="min-h-screen bg-brand-cream-50 dark:bg-brand-charcoal-900 transition-colors duration-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER BRAND BLOCK */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-brand-orange-100/10 dark:border-brand-gold-900/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-sandalwood-900 to-brand-gold-900 flex items-center justify-center text-brand-cream-100 shadow-md">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-brand-charcoal-900 dark:text-brand-cream-50 uppercase tracking-tight">
                Logistics Dispatch Terminal
              </h2>
              <p className="text-[10px] text-brand-charcoal-500 dark:text-brand-cream-300 font-extrabold uppercase tracking-widest mt-0.5">
                KK HQ Central Administration
              </p>
            </div>
          </div>

          {/* TAB SEGMENTS */}
          <div className="flex items-center gap-2 border border-brand-charcoal-200 dark:border-brand-charcoal-800 rounded-xl p-1 bg-white dark:bg-brand-charcoal-900 max-w-full overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-brand-sandalwood-800 text-brand-cream-50 dark:bg-brand-gold-900 dark:text-brand-charcoal-900 shadow-sm'
                  : 'text-brand-charcoal-600 dark:text-brand-cream-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-brand-sandalwood-800 text-brand-cream-50 dark:bg-brand-gold-900 dark:text-brand-charcoal-900 shadow-sm'
                  : 'text-brand-charcoal-600 dark:text-brand-cream-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Active Dispatches ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-brand-sandalwood-800 text-brand-cream-50 dark:bg-brand-gold-900 dark:text-brand-charcoal-900 shadow-sm'
                  : 'text-brand-charcoal-600 dark:text-brand-cream-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              ERP Catalog ({productsList.length})
            </button>
            <button
              onClick={() => setActiveTab('verifier')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'verifier'
                  ? 'bg-brand-sandalwood-800 text-brand-cream-50 dark:bg-brand-gold-900 dark:text-brand-charcoal-900 shadow-sm animate-pulse'
                  : 'text-brand-charcoal-650 dark:text-brand-cream-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Image Verifier
            </button>
          </div>
        </div>

        {/* METRICS ROW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm space-y-1.5">
            <DollarSign className="w-5 h-5 text-brand-sandalwood-700 dark:text-brand-gold-900" />
            <p className="text-[10px] text-brand-charcoal-400 dark:text-brand-cream-300 font-extrabold uppercase tracking-widest leading-none">
              Gross Volume (GMV)
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-brand-charcoal-900 dark:text-brand-cream-50">
              ₹8,50,000
            </h4>
            <span className="text-[9px] text-emerald-600 font-extrabold uppercase">
              +14% growth monthly
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm space-y-1.5">
            <ShoppingBag className="w-5 h-5 text-brand-sandalwood-700 dark:text-brand-gold-900" />
            <p className="text-[10px] text-brand-charcoal-400 dark:text-brand-cream-300 font-extrabold uppercase tracking-widest leading-none">
              Pending Dispatches
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-brand-charcoal-900 dark:text-brand-cream-50">
              {orders.filter((o) => o.status !== 'Delivered').length} orders
            </h4>
            <span className="text-[9px] text-brand-sandalwood-800 dark:text-brand-gold-900 font-extrabold uppercase">
              Average 2.2hr packing
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm space-y-1.5">
            <Users className="w-5 h-5 text-brand-sandalwood-700 dark:text-brand-gold-900" />
            <p className="text-[10px] text-brand-charcoal-400 dark:text-brand-cream-300 font-extrabold uppercase tracking-widest leading-none">
              Active Store Partners
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-brand-charcoal-900 dark:text-brand-cream-50">
              512 Shops
            </h4>
            <span className="text-[9px] text-emerald-600 font-extrabold uppercase">
              +18 wholesale signs
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm space-y-1.5">
            <Truck className="w-5 h-5 text-brand-sandalwood-700 dark:text-brand-gold-900" />
            <p className="text-[10px] text-brand-charcoal-400 dark:text-brand-cream-300 font-extrabold uppercase tracking-widest leading-none">
              Fulfillment Rate
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-brand-charcoal-900 dark:text-brand-cream-50">
              99.8%
            </h4>
            <span className="text-[9px] text-emerald-600 font-extrabold uppercase">
              World Class Standard
            </span>
          </div>
        </div>

        {/* ACTIVE TAB DISPLAY NODES */}
        {activeTab === 'analytics' && (
          
          /* ANALYTICS CHARTS TAB */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* AREA CHART: VOLUME REVENUE */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-charcoal-550 dark:text-brand-cream-300">
                Monthly Wholesale Gross Revenue Trend
              </h3>
              <div className="w-full h-[320px] text-xs font-semibold">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ANALYTICS_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A37754" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#A37754" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#A3A3A3" />
                    <YAxis stroke="#A3A3A3" />
                    <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, 'Wholesale Volume']} />
                    <Area type="monotone" dataKey="sales" stroke="#A37754" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PIE CHART: CATEGORIES DISTRIBUTION */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm space-y-4 flex flex-col justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-charcoal-550 dark:text-brand-cream-300">
                Category Stock Splits
              </h3>
              
              <div className="w-full h-[200px] flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-brand-charcoal-400 uppercase font-extrabold">Active Lines</span>
                  <span className="text-lg font-black text-brand-charcoal-900 dark:text-brand-cream-50">{pieData.length} Lines</span>
                </div>
              </div>

              {/* PIE LEGEND */}
              <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase tracking-wider text-brand-charcoal-600 dark:text-brand-cream-300 max-h-[120px] overflow-y-auto no-scrollbar">
                {pieData.map((e, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
                    <span className="truncate">{e.name} ({e.value} items)</span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* DISPATCH FLOW CHEKCLIST TABLE TAB */}
        {activeTab === 'orders' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-orange-100/10 dark:border-brand-gold-900/10 text-[10px] font-bold uppercase tracking-widest text-brand-charcoal-400">
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Store / Merchant</th>
                  <th className="pb-4">Items count</th>
                  <th className="pb-4">Total Settled</th>
                  <th className="pb-4">Time Node</th>
                  <th className="pb-4">Logistics State Dispatch</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-brand-charcoal-800 dark:text-brand-cream-200">
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-brand-orange-100/5 dark:border-brand-gold-900/5 last:border-0">
                    <td className="py-4 font-extrabold text-brand-sandalwood-700 dark:text-brand-gold-900">{o.id}</td>
                    <td className="py-4">
                      <div>
                        <p className="font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase">{o.storeName}</p>
                        <p className="text-[9px] text-brand-charcoal-400">+91 {o.phone}</p>
                      </div>
                    </td>
                    <td className="py-4">{o.itemsCount} Products</td>
                    <td className="py-4 font-bold text-brand-charcoal-950 dark:text-brand-cream-50">₹{o.totalAmount}</td>
                    <td className="py-4 text-brand-charcoal-500">{o.time}</td>
                    <td className="py-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as MockOrder['status'])}
                        className={`text-[10px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1.5 border focus:outline-none focus:ring-1 focus:ring-brand-sandalwood-900 ${
                          o.status === 'Placed'
                            ? 'bg-blue-50/90 text-blue-600 border-blue-500/20'
                            : o.status === 'Packing'
                            ? 'bg-amber-50/90 text-amber-600 border-amber-500/20 animate-pulse'
                            : o.status === 'Dispatched'
                            ? 'bg-orange-50/90 text-orange-600 border-orange-500/20'
                            : 'bg-emerald-50/90 text-emerald-600 border-emerald-500/20'
                        }`}
                      >
                        <option value="Placed">Order Placed</option>
                        <option value="Packing">Warehouse Packing</option>
                        <option value="Dispatched">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CATALOG MANAGEMENT ERP TAB */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* REGISTER NEW PRODUCT FORM (LEFT) */}
            <form onSubmit={handleAddProduct} className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-charcoal-550 dark:text-brand-cream-300 pb-2 border-b border-brand-orange-100/10 dark:border-brand-gold-900/10 flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-sandalwood-700 dark:text-brand-gold-900" />
                Register Product
              </h3>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-brand-charcoal-550 uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  placeholder="E.g., Bansuri Classic 120g"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-brand-charcoal-250 dark:border-brand-charcoal-800 bg-brand-cream-50 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-brand-charcoal-550 uppercase tracking-wider">Select Category</label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-brand-charcoal-250 dark:border-brand-charcoal-800 bg-brand-cream-50 dark:bg-brand-charcoal-950 text-brand-charcoal-850 dark:text-brand-cream-100 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-brand-charcoal-550 uppercase tracking-wider">Retail MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="60"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-brand-charcoal-250 dark:border-brand-charcoal-800 bg-brand-cream-50 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-brand-charcoal-550 uppercase tracking-wider">Wholesale B2B (₹)</label>
                  <input
                    type="number"
                    placeholder="44"
                    value={newProductB2BPrice}
                    onChange={(e) => setNewProductB2BPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-brand-charcoal-250 dark:border-brand-charcoal-800 bg-brand-cream-50 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-brand-charcoal-550 uppercase tracking-wider">Package Unit</label>
                  <input
                    type="text"
                    value={newProductUnit}
                    onChange={(e) => setNewProductUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-brand-charcoal-250 dark:border-brand-charcoal-800 bg-brand-cream-50 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-brand-charcoal-550 uppercase tracking-wider">Stock Volume</label>
                  <input
                    type="number"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-brand-charcoal-250 dark:border-brand-charcoal-800 bg-brand-cream-50 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-tr from-brand-sandalwood-900 to-brand-gold-900 text-brand-cream-100 text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all cursor-pointer font-bold"
              >
                Insert to Catalog
              </button>
            </form>

            {/* DYNAMIC CATALOG TABLE DISPLAY (RIGHT) */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm overflow-x-auto no-scrollbar max-h-[460px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-orange-100/10 dark:border-brand-gold-900/10 text-[9px] font-bold uppercase tracking-widest text-brand-charcoal-400">
                    <th className="pb-3">Product details</th>
                    <th className="pb-3">Retail Price (MRP)</th>
                    <th className="pb-3">Wholesale Price</th>
                    <th className="pb-3">Stock Units</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-semibold text-brand-charcoal-800 dark:text-brand-cream-200">
                  {productsList.map((p) => (
                    <tr key={p.id} className="border-b border-brand-orange-100/5 dark:border-brand-gold-900/5 last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 relative border border-brand-sandalwood-500/15">
                            <OptimizedImage
                              productId={p.id}
                              category={p.category}
                              alt={p.name}
                              className="w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase truncate max-w-[200px]">{p.name}</p>
                            <p className="text-[9px] text-brand-charcoal-400 uppercase leading-none">{p.unit} &bull; {p.id.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-bold">₹{p.price}</td>
                      <td className="py-3 text-brand-sandalwood-800 dark:text-brand-gold-900 font-extrabold">₹{p.b2bPrice} <span className="text-[8px] text-brand-charcoal-400 font-semibold">({p.minB2bQty} min)</span></td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.stock < 300 ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/20' : 'bg-brand-cream-100 text-brand-charcoal-700 dark:bg-brand-charcoal-850 dark:text-brand-cream-200'}`}>
                          {p.stock} units
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* AI CATALOG IMAGE MATCHING & VERIFICATION TAB */}
        {activeTab === 'verifier' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* PRODUCT SELECTOR SIDEBAR (LEFT) */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-sandalwood-500/10 dark:border-brand-gold-900/10 shadow-sm space-y-4">
              <div className="border-b border-brand-sandalwood-500/15 dark:border-brand-gold-900/15 pb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-sandalwood-900 dark:text-brand-gold-900 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Wholesale SKUs ({productsList.length})
                </h3>
                <p className="text-[9px] text-brand-charcoal-400 dark:text-brand-cream-300 font-semibold uppercase mt-0.5">
                  Select a product to verify matches
                </p>
              </div>

              {/* LIST DISPLAY */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                {productsList.map((p) => {
                  const status = verifiedProducts[p.id] || 'pending';
                  const isSelected = selectedVerifyProduct.id === p.id;

                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedVerifyProduct(p)}
                      className={`w-full text-left p-3 rounded-xl border flex items-center justify-between gap-3 transition-all duration-200 hover:scale-[1.01] cursor-pointer ${
                        isSelected
                          ? 'bg-brand-sandalwood-900 border-transparent text-brand-cream-50 shadow-md shadow-brand-sandalwood-900/15'
                          : 'bg-brand-cream-50 dark:bg-brand-charcoal-950 border-brand-sandalwood-500/10 hover:border-brand-sandalwood-500/20 text-brand-charcoal-800 dark:text-brand-cream-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-brand-sandalwood-500/10 relative">
                          <OptimizedImage
                            productId={p.id}
                            category={p.category}
                            alt={p.name}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="truncate">
                          <p className={`text-[10px] font-bold uppercase truncate ${isSelected ? 'text-brand-cream-50' : 'text-brand-charcoal-900 dark:text-brand-cream-50'}`}>
                            {p.name.replace('Bansuri ', '').replace('Agarbathi ', '')}
                          </p>
                          <p className={`text-[8px] font-medium uppercase mt-0.5 ${isSelected ? 'text-brand-cream-200' : 'text-brand-charcoal-400'}`}>
                            MRP: ₹{p.price} &bull; {p.unit}
                          </p>
                        </div>
                      </div>

                      {/* APPROVAL STATUS ICON BADGE */}
                      <div>
                        {status === 'approved' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/10 flex-shrink-0" />
                        ) : status === 'rejected' ? (
                          <XCircle className="w-4 h-4 text-red-500 fill-red-500/10 flex-shrink-0" />
                        ) : (
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 animate-pulse ${isSelected ? 'bg-brand-gold-900' : 'bg-amber-400'}`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DUAL PANE VERIFICATION BOARD (RIGHT) */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-sandalwood-500/10 dark:border-brand-gold-900/10 shadow-sm">
                
                {/* VERIFICATION HEADER ROW */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-brand-sandalwood-500/15 dark:border-brand-gold-900/15 mb-6">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-brand-charcoal-900 dark:text-brand-cream-50 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-gold-900 animate-pulse" />
                      Visual Packaging Alignment
                    </h3>
                    <p className="text-[9px] text-brand-charcoal-400 dark:text-brand-cream-300 font-semibold uppercase mt-0.5">
                      Verify matched wholesale pack specs against catalog definitions
                    </p>
                  </div>

                  {/* ACTIVE VERIFICATION STATE BADGES */}
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1.5 rounded-lg border border-brand-sandalwood-500/20 bg-brand-sandalwood-900/5 text-brand-sandalwood-900 dark:text-brand-gold-900 text-[8px] font-extrabold uppercase tracking-widest">
                      ID: {selectedVerifyProduct.id.toUpperCase()}
                    </span>
                    {verifiedProducts[selectedVerifyProduct.id] === 'approved' ? (
                      <span className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[8px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> VERIFIED
                      </span>
                    ) : verifiedProducts[selectedVerifyProduct.id] === 'rejected' ? (
                      <span className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-600 border border-red-500/20 text-[8px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> REJECTED / PDF CROP
                      </span>
                    ) : (
                      <span className="px-2.5 py-1.5 rounded-lg bg-amber-400/10 text-amber-600 border border-amber-500/20 text-[8px] font-extrabold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                        <AlertCircle className="w-3 h-3" /> PENDING REVIEW
                      </span>
                    )}
                  </div>
                </div>

                {/* THE DUAL WINDOWS CONTAINER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* LEFT PANE: PDF REFERENCE DEFINITION */}
                  <div className="p-4 rounded-xl bg-brand-cream-100/50 dark:bg-brand-charcoal-950/40 border border-brand-sandalwood-500/20 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-brand-sandalwood-900 text-brand-cream-50 text-[7px] font-extrabold uppercase tracking-wider shadow">
                      PDF SPEC PAGE
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-brand-sandalwood-800 dark:text-brand-gold-900">
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="text-[9px] font-extrabold uppercase tracking-widest border-b border-brand-sandalwood-500/30 pb-0.5">Bansuri Catalog Specs</span>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase text-brand-charcoal-900 dark:text-brand-cream-50 leading-tight">
                          {selectedVerifyProduct.name}
                        </h4>
                        <span className="inline-block px-2 py-0.5 text-[8px] font-bold bg-brand-sandalwood-900/10 text-brand-sandalwood-900 dark:bg-brand-gold-900/10 dark:text-brand-gold-900 uppercase rounded">
                          {CATEGORIES.find(c => c.id === selectedVerifyProduct.category)?.name}
                        </span>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-brand-sandalwood-500/10 text-[9px] text-brand-charcoal-600 dark:text-brand-cream-200 font-semibold space-y-1">
                        <p className="flex justify-between">
                          <span className="text-brand-charcoal-400">TARGET MRP:</span>
                          <span className="font-extrabold text-brand-charcoal-900 dark:text-brand-cream-50">₹{selectedVerifyProduct.price}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-brand-charcoal-400">PACK FORMAT:</span>
                          <span className="font-extrabold text-brand-charcoal-900 dark:text-brand-cream-50">{selectedVerifyProduct.unit}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-brand-charcoal-400">FRAGRANCE ORIGIN:</span>
                          <span className="font-extrabold text-brand-charcoal-900 dark:text-brand-cream-50">{selectedVerifyProduct.origin}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-brand-charcoal-400">GST DIVISION:</span>
                          <span className="font-extrabold text-brand-charcoal-900 dark:text-brand-cream-50">{selectedVerifyProduct.gstRate}% Tax Bracket</span>
                        </p>
                      </div>
                    </div>

                    {/* MOCK TECHNICAL CRITERIA TAGS */}
                    <div className="pt-4 border-t border-brand-sandalwood-500/15">
                      <p className="text-[7px] text-brand-charcoal-400 uppercase font-black tracking-widest mb-1.5">TECHNICAL CRITERIA</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-brand-cream-200 text-brand-sandalwood-900 text-[8px] font-extrabold uppercase tracking-wide">
                          {selectedVerifyProduct.name.toLowerCase().includes('lavender') ? 'Chroma: Violet' : selectedVerifyProduct.name.toLowerCase().includes('rose') ? 'Chroma: Rose Crimson' : 'Chroma: Sandal Gold'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-brand-cream-200 text-brand-sandalwood-900 text-[8px] font-extrabold uppercase tracking-wide">
                          Ratio: 4:3 Product Crop
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-brand-cream-200 text-brand-sandalwood-900 text-[8px] font-extrabold uppercase tracking-wide">
                          OCR: "Bansuri"
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT PANE: ACTIVE SCRAPED IMAGE RENDERING */}
                  <div className="flex flex-col justify-between min-h-[300px]">
                    
                    {/* ACTIVE IMAGE CARD VIEWER */}
                    <div className="w-full h-48 rounded-xl overflow-hidden shadow-inner border border-brand-sandalwood-500/20 relative group/view flex items-center justify-center bg-brand-cream-50 dark:bg-brand-charcoal-950">
                      
                      {isScraping ? (
                        /* SCRAPE SPINNING LOADER MOCK */
                        <div className="absolute inset-0 bg-brand-cream-50/90 dark:bg-brand-charcoal-950/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3 text-center">
                          <RefreshCw className="w-7 h-7 text-brand-sandalwood-500 animate-spin" />
                          <p className="text-[10px] text-brand-sandalwood-800 dark:text-brand-gold-900 font-extrabold uppercase tracking-widest animate-pulse">
                            Searching B2B Platforms...
                          </p>
                        </div>
                      ) : null}

                      {/* DISPLAY TARGET SPECIFIC IMAGE OR PDF FALLBACK NOTIFICATION */}
                      <OptimizedImage
                        productId={selectedVerifyProduct.id}
                        category={selectedVerifyProduct.category}
                        alt={selectedVerifyProduct.name}
                        className="w-full h-full"
                      />

                      {/* CROP MODE LABEL OVERLAY */}
                      {usePdfCrop && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600 text-white text-[7px] font-extrabold uppercase tracking-wider animate-pulse shadow z-10">
                          PDF CROP ACTIVE
                        </div>
                      )}

                      {/* CONFIDENCE OVERLAY CORNER */}
                      {!isScraping && (
                        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider z-10 flex items-center gap-1 shadow-md">
                          <Sparkles className="w-3 h-3 text-brand-gold-900 animate-pulse" />
                          <span>{confidenceScore}% Match</span>
                        </div>
                      )}
                    </div>

                    {/* CONFIDENCE ANALYSIS PROGRESS GAUGE */}
                    <div className="space-y-1.5 pt-3">
                      <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest">
                        <span className="text-brand-charcoal-400">Scrape Channel:</span>
                        <span className="text-brand-sandalwood-900 dark:text-brand-gold-900 font-extrabold">{activeScrapeChannel}</span>
                      </div>
                      <div className="w-full h-1.5 bg-brand-cream-200 dark:bg-brand-charcoal-800 rounded-full overflow-hidden relative shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-brand-sandalwood-500 to-brand-gold-900 transition-all duration-500 rounded-full"
                          style={{ width: `${isScraping ? 0 : confidenceScore}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[7px] font-extrabold text-brand-charcoal-400 uppercase tracking-widest pt-1">
                        <span>OCR: {confidenceScore > 88 ? 'VERIFIED MATCH' : 'FUZZY MATCH'}</span>
                        <span>Color: {selectedVerifyProduct.name.toLowerCase().includes('lavender') ? 'Violet Match' : 'Sandalwood Amber Match'}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* BOARD ACTION CONTROLS BUTTONS */}
                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-brand-sandalwood-500/15 mt-6">
                  <button
                    onClick={() => approveProductImage(selectedVerifyProduct.id)}
                    className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[10px] font-black uppercase tracking-widest text-brand-cream-50 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve Image</span>
                  </button>

                  <button
                    onClick={() => rejectProductImage(selectedVerifyProduct.id)}
                    className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-[10px] font-black uppercase tracking-widest text-brand-cream-50 hover:shadow-lg hover:shadow-red-500/10 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Online Spec</span>
                  </button>

                  <button
                    onClick={triggerRescrape}
                    disabled={isScraping}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl border border-brand-sandalwood-500/20 bg-brand-cream-50 dark:bg-brand-charcoal-950 text-[10px] font-black uppercase tracking-widest text-brand-sandalwood-900 dark:text-brand-cream-50 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
                    <span>Re-Search Portals</span>
                  </button>
                </div>

              </div>

              {/* AUTOMATED BULK PIPELINE WARNING CARD */}
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-300 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                <div className="space-y-1.5 text-left">
                  <h4 className="text-[10px] font-black uppercase tracking-wider leading-none">Automated Scraper Daemon Enabled</h4>
                  <p className="text-[9px] font-semibold leading-relaxed">
                    The hybrid scraper is currently scanning Amazon India and IndiaMART nodes for inventory pack listings. Approving a match instantly copies the asset, optimizes resolution ratios, and uploads it to the active merchant storefront. Rejecting forces a direct catalog PDF layout crop translation.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
export default AdminDashboard;
