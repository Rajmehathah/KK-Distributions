import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { LayoutDashboard, ShoppingBag, Users, Truck, Plus, DollarSign } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../../data/dummyData';
import type { Product } from '../../data/dummyData';
import { showToast } from '../../store/toastStore';

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
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products'>('analytics');

  // Product addition state
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(CATEGORIES[0].id);
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductB2BPrice, setNewProductB2BPrice] = useState('');
  const [newProductMinB2B] = useState('10');
  const [newProductUnit, setNewProductUnit] = useState('Pack of 12');
  const [newProductStock, setNewProductStock] = useState('500');

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
      image: 'bg-gradient-to-tr from-brand-orange-800 to-brand-gold-800',
      isNew: true,
      gstRate: 18,
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

  // Compile Category splits for Recharts Pie Chart
  const pieData = CATEGORIES.map((cat, idx) => {
    const count = PRODUCTS.filter((p) => p.category === cat.id).length;
    return { name: cat.name.split(' ')[0], value: count, color: PIE_COLORS[idx % PIE_COLORS.length] };
  });

  return (
    <div className="min-h-screen bg-brand-cream-50 dark:bg-brand-charcoal-900 transition-colors duration-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER BRAND BLOCK */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-brand-orange-100/10 dark:border-brand-gold-900/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 flex items-center justify-center text-brand-cream-100 shadow-md">
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
          <div className="flex items-center gap-2 border border-brand-charcoal-200 dark:border-brand-charcoal-800 rounded-xl p-1 bg-white dark:bg-brand-charcoal-900">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-brand-orange-900 text-brand-cream-100 dark:bg-brand-gold-900 dark:text-brand-charcoal-900 shadow-sm'
                  : 'text-brand-charcoal-600 dark:text-brand-cream-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'orders'
                  ? 'bg-brand-orange-900 text-brand-cream-100 dark:bg-brand-gold-900 dark:text-brand-charcoal-900 shadow-sm'
                  : 'text-brand-charcoal-600 dark:text-brand-cream-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Active Dispatches ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'products'
                  ? 'bg-brand-orange-900 text-brand-cream-100 dark:bg-brand-gold-900 dark:text-brand-charcoal-900 shadow-sm'
                  : 'text-brand-charcoal-600 dark:text-brand-cream-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              ERP Catalog ({productsList.length})
            </button>
          </div>
        </div>

        {/* METRICS ROW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm space-y-1.5">
            <DollarSign className="w-5 h-5 text-brand-orange-900 dark:text-brand-gold-900" />
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
            <ShoppingBag className="w-5 h-5 text-brand-orange-900 dark:text-brand-gold-900" />
            <p className="text-[10px] text-brand-charcoal-400 dark:text-brand-cream-300 font-extrabold uppercase tracking-widest leading-none">
              Pending Dispatches
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-brand-charcoal-900 dark:text-brand-cream-50">
              {orders.filter((o) => o.status !== 'Delivered').length} orders
            </h4>
            <span className="text-[9px] text-brand-orange-950 dark:text-brand-gold-900 font-extrabold uppercase">
              Average 2.2hr packing
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 shadow-sm space-y-1.5">
            <Users className="w-5 h-5 text-brand-orange-900 dark:text-brand-gold-900" />
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
            <Truck className="w-5 h-5 text-brand-orange-900 dark:text-brand-gold-900" />
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
                        <stop offset="5%" stopColor="#E65100" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#E65100" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#A3A3A3" />
                    <YAxis stroke="#A3A3A3" />
                    <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, 'Wholesale Volume']} />
                    <Area type="monotone" dataKey="sales" stroke="#E65100" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
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
                  <span className="text-lg font-black text-brand-charcoal-900 dark:text-brand-cream-50">6 Lines</span>
                </div>
              </div>

              {/* PIE LEGEND */}
              <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase tracking-wider text-brand-charcoal-600 dark:text-brand-cream-300">
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
                    <td className="py-4 font-extrabold text-brand-orange-900 dark:text-brand-gold-900">{o.id}</td>
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
                        className={`text-[10px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1.5 border focus:outline-none focus:ring-1 focus:ring-brand-orange-900 ${
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
                <Plus className="w-4 h-4 text-brand-orange-950 dark:text-brand-gold-900" />
                Register Product
              </h3>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-brand-charcoal-550 uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  placeholder="E.g., Honey Premium Biscuit"
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
                  <label className="text-[9px] font-bold text-brand-charcoal-550 uppercase tracking-wider">Retail (₹)</label>
                  <input
                    type="number"
                    placeholder="80"
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
                    placeholder="60"
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
                className="w-full py-2.5 rounded-xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 text-brand-cream-100 text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all"
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
                    <th className="pb-3">Retail Price</th>
                    <th className="pb-3">Wholesale Price</th>
                    <th className="pb-3">Stock Units</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-semibold text-brand-charcoal-800 dark:text-brand-cream-200">
                  {productsList.map((p) => (
                    <tr key={p.id} className="border-b border-brand-orange-100/5 dark:border-brand-gold-900/5 last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg ${p.image} shadow-inner flex-shrink-0 flex items-center justify-center text-[8px] text-brand-cream-100 font-bold uppercase text-center leading-none`}>
                            {p.name.split(' ')[0]}
                          </div>
                          <div>
                            <p className="font-bold text-brand-charcoal-900 dark:text-brand-cream-50 uppercase truncate max-w-[150px]">{p.name}</p>
                            <p className="text-[9px] text-brand-charcoal-400 uppercase leading-none">{p.unit} &bull; {p.id.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">₹{p.price}</td>
                      <td className="py-3 text-brand-orange-950 dark:text-brand-gold-900 font-bold">₹{p.b2bPrice} <span className="text-[8px] text-brand-charcoal-400">({p.minB2bQty})</span></td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.stock < 300 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-brand-cream-100 text-brand-charcoal-700'}`}>
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

      </div>
    </div>
  );
};
export default AdminDashboard;
