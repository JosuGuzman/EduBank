// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Users, Banknote, ArrowLeftRight, DollarSign, Plus } from 'lucide-react';
import { StatCard } from '../components/UI/StatCard';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';


const Dashboard = () => {
  const [stats, setStats] = useState({
    usuarios: 0,
    cuentas: 0,
    transacciones: 0,
    prestamos: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Aquí puedes hacer las llamadas a tu API
    // Por ahora usamos datos de ejemplo
    setTimeout(() => {
      setStats({
        usuarios: 156,
        cuentas: 234,
        transacciones: 1829,
        prestamos: 45
      });
      setLoading(false);
    }, 500);
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Usuarios" 
          value={stats.usuarios} 
          icon={Users} 
          color="blue" 
        />
        <StatCard 
          title="Total Cuentas" 
          value={stats.cuentas} 
          icon={Banknote} 
          color="green" 
        />
        <StatCard 
          title="Transacciones" 
          value={stats.transacciones} 
          icon={ArrowLeftRight} 
          color="purple" 
        />
        <StatCard 
          title="Préstamos Activos" 
          value={stats.prestamos} 
          icon={DollarSign} 
          color="orange" 
        />
      </div>
      
      {/* Resumen y Acciones Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Resumen del Sistema</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Usuarios registrados:</span>
              <span className="font-bold text-blue-600">{stats.usuarios}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Cuentas activas:</span>
              <span className="font-bold text-green-600">{stats.cuentas}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Transacciones hoy:</span>
              <span className="font-bold text-purple-600">124</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700">Saldo total sistema:</span>
              <span className="font-bold text-orange-600">$45,678,912.00</span>
            </div>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Crear Nueva Cuenta
            </Button>
            <Button variant="secondary" className="w-full">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Nueva Transacción
            </Button>
            <Button variant="success" className="w-full">
              <DollarSign className="w-4 h-4 mr-2" />
              Solicitar Préstamo
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

