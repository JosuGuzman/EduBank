import React from 'react';
import './App.css';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import CuentasPage from './pages/CuentasPage';
import UsuariosPage from './pages/UsuariosPage';
import TransaccionesPage from './pages/TransaccionesPage';
import TarjetasPage from './pages/TarjetasPage';
import PrestamosPage from './pages/PrestamosPage';
import SucursalesPage from './pages/SucursalesPage';
import Navbar from './components/Navbar';

// A wrapper component to handle protected routes
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [showNavbar, setShowNavbar] = useState(false);
  const location = useLocation();

  // Don't show navbar on auth pages
  useEffect(() => {
    setShowNavbar(isAuthenticated && !location.pathname.includes('/login') && !location.pathname.includes('/register'));
  }, [isAuthenticated, location]);

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <div className={showNavbar ? 'container mx-auto px-4 py-8' : ''}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Navigate to="/dashboard" replace /> */}

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <UsuariosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cuentas"
            element={
              <ProtectedRoute>
                <CuentasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transacciones"
            element={
              <ProtectedRoute>
                <TransaccionesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tarjetas"
            element={
              <ProtectedRoute>
                <TarjetasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prestamos"
            element={
              <ProtectedRoute>
                <PrestamosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sucursales"
            element={
              <ProtectedRoute>
                <SucursalesPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all other routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
