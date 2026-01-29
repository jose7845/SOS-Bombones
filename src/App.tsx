import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import PaymentPending from './pages/PaymentPending';
import ScrollToTop from './components/ScrollToTop';
import Profile from './pages/Profile';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage isRegister />} />

        {/* Rutas de Mercado Pago */}
        <Route path="/pago-exitoso" element={<PaymentSuccess />} />
        <Route path="/pago-fallido" element={<PaymentFailure />} />
        <Route path="/pago-pendiente" element={<PaymentPending />} />

        {/* Protected User Routes (Solo login requerido) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<div className="p-10 text-center">Próximamente: Historial de Órdenes</div>} />
        </Route>

        {/* Protected Admin Routes (Admin requerido) */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
