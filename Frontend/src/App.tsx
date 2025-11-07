import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Dashboard from './pages/Dashboard'
import CuentasPage from './pages/CuentasPage'
import UsuariosPage from './pages/UsuariosPage'
import TransaccionesPage from './pages/TransaccionesPage'
import TarjetasPage from './pages/TarjetasPage'
import PrestamosPage from './pages/PrestamosPage'
import SucursalesPage from './pages/SucursalesPage'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import type { JSX } from 'react'

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth()

   console.log("isAuthenticated", isAuthenticated)
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }



  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Rutas protegidas */}
              <Route path="/" element={
                <PrivateRoute>
                  <Navigate to="/dashboard" replace />
                </PrivateRoute>
              } />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/usuarios" element={
                <PrivateRoute>
                  <UsuariosPage />
                </PrivateRoute>
              } />
              
              <Route path="/cuentas" element={
                <PrivateRoute>
                  <CuentasPage />
                </PrivateRoute>
              } />
              
              <Route path="/transacciones" element={
                <PrivateRoute>
                  <TransaccionesPage />
                </PrivateRoute>
              } />
              
              <Route path="/tarjetas" element={
                <PrivateRoute>
                  <TarjetasPage />
                </PrivateRoute>
              } />
              
              <Route path="/prestamos" element={
                <PrivateRoute>
                  <PrestamosPage />
                </PrivateRoute>
              } />
              
              <Route path="/sucursales" element={
                <PrivateRoute>
                  <SucursalesPage />
                </PrivateRoute>
              } />
              
              {/* Redirección para rutas no encontradas */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
