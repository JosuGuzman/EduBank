import React from 'react';
import { useApi } from '../hooks/useApi';
import { usuarioService, cuentaService, transaccionService, prestamoService } from '../services/api';
import { Users, Banknote, ArrowLeftRight, CreditCard, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} mr-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: usuarios, loading: loadingUsuarios } = useApi(usuarioService.listar);
  const { data: cuentas, loading: loadingCuentas } = useApi(cuentaService.listar);
  const { data: transacciones, loading: loadingTransacciones } = useApi(transaccionService.listar);
  const { data: prestamos, loading: loadingPrestamos } = useApi(prestamoService.listar);

  if (loadingUsuarios || loadingCuentas || loadingTransacciones || loadingPrestamos) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  const totalUsuarios = usuarios?.length || 0;
  const totalCuentas = cuentas?.length || 0;
  const totalTransacciones = transacciones?.length || 0;
  const totalPrestamos = prestamos?.length || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Usuarios"
          value={totalUsuarios}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Cuentas"
          value={totalCuentas}
          icon={Banknote}
          color="bg-green-500"
        />
        <StatCard
          title="Transacciones"
          value={totalTransacciones}
          icon={ArrowLeftRight}
          color="bg-purple-500"
        />
        <StatCard
          title="Préstamos Activos"
          value={totalPrestamos}
          icon={CreditCard}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Resumen del Sistema</h2>
          <div className="space-y-3">
            <p><span className="font-medium">Usuarios registrados:</span> {totalUsuarios}</p>
            <p><span className="font-medium">Cuentas activas:</span> {totalCuentas}</p>
            <p><span className="font-medium">Transacciones realizadas:</span> {totalTransacciones}</p>
            <p><span className="font-medium">Préstamos gestionados:</span> {totalPrestamos}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
              Crear Nueva Cuenta
            </button>
            <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors">
              Realizar Transacción
            </button>
            <button className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors">
              Solicitar Préstamo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;