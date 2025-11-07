import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';

interface Tarjeta {
    IdTarjeta: number;
    NumeroTarjeta: string;
    Tipo: string;
    Titular: string;
    FechaVencimiento: string;
    LimiteCredito: number;
    SaldoDisponible: number;
    Activa: boolean;
}

const TarjetasPage = () => {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setTarjetas([
        { IdTarjeta: 1, NumeroTarjeta: '4555 **** **** 3333', Tipo: 'credito', Titular: 'Juan Pérez', FechaVencimiento: '12/2028', LimiteCredito: 100000, SaldoDisponible: 85000, Activa: true },
        { IdTarjeta: 2, NumeroTarjeta: '4111 **** **** 3333', Tipo: 'debito', Titular: 'María López', FechaVencimiento: '05/2027', LimiteCredito: 0, SaldoDisponible: 0, Activa: true },
        { IdTarjeta: 3, NumeroTarjeta: '5200 **** **** 1234', Tipo: 'credito', Titular: 'Carlos García', FechaVencimiento: '08/2029', LimiteCredito: 150000, SaldoDisponible: 120000, Activa: true },
      ]);
      setLoading(false);
    }, 500);
  }, []);
  
  const columns = [
    { key: 'NumeroTarjeta', label: 'Número' },
    { 
      key: 'Tipo', 
      label: 'Tipo',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val === 'credito' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
          {val === 'credito' ? 'Crédito' : 'Débito'}
        </span>
      )
    },
    { key: 'Titular', label: 'Titular' },
    { key: 'FechaVencimiento', label: 'Vencimiento' },
    { 
      key: 'SaldoDisponible', 
      label: 'Disponible',
      render: (val: number, row: Tarjeta) => 
        row.Tipo === 'credito' 
          ? <span className="font-semibold text-green-600">${val?.toLocaleString('es-AR', {minimumFractionDigits: 2}) || 0}</span>
          : <span className="text-gray-400">N/A</span>
    },
    { 
      key: 'Activa', 
      label: 'Estado',
      render: (val: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {val ? 'Activa' : 'Bloqueada'}
        </span>
      )
    }
  ];
  
  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Tarjetas</h1>
        <Button><Plus className="w-4 h-4 mr-2" />Nueva Tarjeta</Button>
      </div>
      <Card>
        <Table columns={columns} data={tarjetas} onEdit={() => {}} onDelete={() => {}} />
      </Card>
    </div>
  );
};

export default TarjetasPage;