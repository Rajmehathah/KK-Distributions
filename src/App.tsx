import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBottomBar from './components/layout/MobileBottomBar';
import CartDrawer from './components/common/CartDrawer';
import ToastContainer from './components/common/ToastContainer';
import AIChatbot from './components/common/AIChatbot';

// Routed pages
import LandingPage from './pages/landing/LandingPage';
import ProductListingPage from './pages/products/ProductListingPage';
import AuthPage from './pages/auth/AuthPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import { useAuthStore } from './store/authStore';

// Protected Route for Retailers/Customers
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/auth?redirect=checkout" replace />;
};

// Protected Route for Admin Dashboard
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" replace />;
};

// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen pb-16 md:pb-0 bg-brand-cream-50 text-brand-charcoal-900 dark:bg-brand-charcoal-900 dark:text-brand-cream-50 transition-colors duration-300">
          
          {/* GLOBAL SHELL COMPONENT */}
          <Navbar />

          {/* DYNAMIC SCROLL CONTAINER */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/orders" element={<ProductListingPage />} />
              <Route path="/dealer" element={<AuthPage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <CheckoutPage />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* CINEMATIC FOOTER */}
          <Footer />

          {/* MOBILE BOTTOM APP-BAR */}
          <MobileBottomBar />

          {/* FLOATING TRIGGERS & PORTALS */}
          <CartDrawer />
          <ToastContainer />
          <AIChatbot />

        </div>
      </Router>
    </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
