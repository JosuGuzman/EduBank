import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UsuariosPage from './pages/UsuariosPage';
import CuentasPage from './pages/CuentasPage';
import TransaccionesPage from './pages/TransaccionesPage';
import TarjetasPage from './pages/TarjetasPage';
import PrestamosPage from './pages/PrestamosPage';
import SucursalesPage from './pages/SucursalesPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/cuentas" element={<CuentasPage />} />
            <Route path="/transacciones" element={<TransaccionesPage />} />
            <Route path="/tarjetas" element={<TarjetasPage />} />
            <Route path="/prestamos" element={<PrestamosPage />} />
            <Route path="/sucursales" element={<SucursalesPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;