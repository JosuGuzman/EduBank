import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';
import { tarjetaService, type Tarjeta, type TipoTarjeta, type EstadoTarjeta } from '../services/tarjetaService';

interface TarjetaConMascara extends Omit<Tarjeta, 'NumeroTarjeta' | 'Tipo' | 'Estado'> {
    NumeroTarjeta: string; // Número con máscara
    Tipo: string; // 'credito' | 'debito' como string para compatibilidad
    Estado: string; // 'activa' | 'inactiva' | 'bloqueada' como string para compatibilidad
}

const TarjetasPage = () => {
    const [tarjetas, setTarjetas] = useState<TarjetaConMascara[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchTarjetas = async () => {
            try {
                const data = await tarjetaService.getTarjetas();
                
                // Formatear los datos para la visualización
                const tarjetasFormateadas = data.map(tarjeta => ({
                    ...tarjeta,
                    NumeroTarjeta: `${tarjeta.NumeroTarjeta.substring(0, 4)} **** **** ${tarjeta.NumeroTarjeta.substring(tarjeta.NumeroTarjeta.length - 4)}`,
                    FechaVencimiento: new Date(tarjeta.FechaVencimiento).toLocaleDateString('es-AR', { month: '2-digit', year: '2-digit' }),
                    Activa: tarjeta.Estado === 'activa',
                    // Mantener compatibilidad con la interfaz existente
                    // SaldoDisponible: tarjeta.SaldoDisponible || 0,
                    // Convertir a string para mantener compatibilidad
                    Tipo: tarjeta.Tipo as string,
                    Estado: tarjeta.Estado as string
                }));
                
                setTarjetas(tarjetasFormateadas);
                setError(null);
            } catch (err) {
                console.error('Error al cargar las tarjetas:', err);
                setError('No se pudieron cargar las tarjetas. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchTarjetas();
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
  
  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error}</span>
  </div>;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Tarjetas</h1>
        <Button onClick={() => {}}><Plus className="w-4 h-4 mr-2" />Nueva Tarjeta</Button>
      </div>
      <Card>
        <Table 
            columns={columns} 
            data={tarjetas} 
            onEdit={(tarjeta) => {
                // Implementar lógica de edición
                console.log('Editar tarjeta:', tarjeta);
            }}
            onDelete={async (tarjeta) => {
                if (window.confirm(`¿Está seguro de que desea ${tarjeta.Activa ? 'bloquear' : 'activar'} la tarjeta ${tarjeta.NumeroTarjeta}?`)) {
                    try {
                        const nuevoEstado: EstadoTarjeta = tarjeta.Activa ? 'bloqueada' : 'activa';
                        await tarjetaService.updateTarjeta(tarjeta.IdTarjeta, { Estado: nuevoEstado });
                        
                        // Actualizar el estado local
                        setTarjetas(tarjetas.map(t => 
                            t.IdTarjeta === tarjeta.IdTarjeta 
                                ? { 
                                    ...t, 
                                    Estado: nuevoEstado,
                                    Activa: nuevoEstado === 'activa'
                                  } 
                                : t
                        ));
                    } catch (err) {
                        console.error('Error al actualizar el estado de la tarjeta:', err);
                        alert('No se pudo actualizar el estado de la tarjeta. Por favor, intente nuevamente.');
                    }
                }
            }} 
        />
      </Card>
    </div>
  );
};

export default TarjetasPage;