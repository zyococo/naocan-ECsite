import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AdminProvider } from './context/AdminContext';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import Home from './pages/Home';
import BuddhistFlowers from './pages/BuddhistFlowers';
import PreservedFlowers from './pages/PreservedFlowers';
import Contact from './pages/Contact';
import Guide from './pages/Guide';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Reservation from './pages/Reservation';
import AuthCallback from './pages/AuthCallback';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProducts from './pages/admin/AdminProducts';
import AdminReservations from './pages/admin/AdminReservations';
import AdminSlots from './pages/admin/AdminSlots';
import AdminProductForm from './pages/AdminProductForm';
import AdminSlotForm from './pages/AdminSlotForm';

// Components
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';

// Component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <AdminProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {/* Admin Routes - Completely Separate */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }>
                  <Route path="dashboard" element={<AdminOverview />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductForm />} />
                  <Route path="products/edit/:id" element={<AdminProductForm />} />
                  <Route path="reservations" element={<AdminReservations />} />
                  <Route path="slots" element={<AdminSlots />} />
                  <Route path="slots/new" element={<AdminSlotForm />} />
                  <Route index element={<AdminOverview />} />
                </Route>
                
                {/* Customer Routes - Public Layout */}
                <Route path="/*" element={<CustomerLayout />}>
                  <Route index element={<Home />} />
                  <Route path="buddhist-flowers" element={<BuddhistFlowers />} />
                  <Route path="preserved-flowers" element={<PreservedFlowers />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="guide" element={<Guide />} />
                  <Route path="reservation" element={<Reservation />} />
                  <Route path="product/:id" element={<ProductDetail />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="auth/callback" element={<AuthCallback />} />
                </Route>
              </Routes>
            </Router>
          </AdminProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;