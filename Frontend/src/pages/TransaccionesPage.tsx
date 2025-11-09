import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';
import { transaccionService, type Transaccion, type TipoTransaccion } from '../services/transaccionService';

interface TransaccionConDetalles extends Omit<Transaccion, 'IdCuentaOrigen' | 'IdCuentaDestino'> {
    // Usamos los campos de UsuarioOrigen y UsuarioDestino que ya vienen en la transacción
}

const TransaccionesPage = () => {
    const [transacciones, setTransacciones] = useState<TransaccionConDetalles[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransacciones = async () => {
            try {
                const transaccionesData = await transaccionService.getTransacciones();


                setTransacciones(transaccionesData);
                setError(null);
            } catch (err) {
                console.error('Error al cargar las transacciones:', err);
                setError('No se pudieron cargar las transacciones. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransacciones();
    }, []);

    const columns = [
        { key: 'Fecha', label: 'Fecha y Hora' },
        {
            key: 'Tipo',
            label: 'Tipo',
            render: (val: TipoTransaccion) => {
                const tipoConfig = {
                    'transferencia': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Transferencia' },
                    'deposito': { bg: 'bg-green-100', text: 'text-green-800', label: 'Depósito' },
                    'retiro': { bg: 'bg-red-100', text: 'text-red-800', label: 'Retiro' },
                    'pago_servicio': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Pago de Servicio' },
                    'pago_prestamo': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pago de Préstamo' }
                };
                // ignorar el error de typescript codigo TS2538
                // @ts-ignore
                const config = tipoConfig[val] || { bg: 'bg-gray-100', text: 'text-gray-800', label: val };
                
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                        {config.label}
                    </span>
                );
            }
        },
        { 
            key: 'CuentaOrigen', 
            label: 'Origen',
            render: (_: any, row: TransaccionConDetalles) => (
                <span className="font-medium">
                    {row.cuentaOrigen?.Alias|| 'Sistema'}
                </span>
            )
        },
        { 
            key: 'CuentaDestino', 
            label: 'Destino',
            render: (_: any, row: TransaccionConDetalles) => {
                console.log(row.cuentaDestino);
                return (
                    <span className="font-medium">
                        {row.cuentaDestino?.Alias || 'Sistema'}
                    </span>
                );
            }
        },
        {
            key: 'Monto',
            label: 'Monto',
            render: (val: number) => (
                <span className="font-semibold text-gray-900">
                    ${val.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
            )
        },
        {
            key: 'Estado',
            label: 'Estado',
            render: (val: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val === 'completado' ? 'bg-green-100 text-green-800' :
                    val === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {val.charAt(0).toUpperCase() + val.slice(1)}
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
                <h1 className="text-3xl font-bold text-gray-900">Transacciones</h1>
                <Button><Plus className="w-4 h-4 mr-2" />Nueva Transacción</Button>
            </div>
            <Card>
                <Table columns={columns} data={transacciones} onEdit={() => { }} onDelete={() => { }} />
            </Card>
        </div>
    );
};

export default TransaccionesPage;