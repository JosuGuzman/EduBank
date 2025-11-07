import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';

interface Transaccion {
    IdTransaccion: number;
    Fecha: string;
    Tipo: string;
    Monto: number;
    CuentaOrigen: string;
    CuentaDestino: string;
    Estado: string;
}

const TransaccionesPage = () => {
    const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setTransacciones([
                { IdTransaccion: 1, Fecha: '2025-01-20 10:30', Tipo: 'transferencia', Monto: 5000, CuentaOrigen: 'juan.ahorro', CuentaDestino: 'maria.corriente', Estado: 'completado' },
                { IdTransaccion: 2, Fecha: '2025-01-20 14:15', Tipo: 'deposito', Monto: 15000, CuentaOrigen: '-', CuentaDestino: 'juan.ahorro', Estado: 'completado' },
                { IdTransaccion: 3, Fecha: '2025-01-21 09:00', Tipo: 'retiro', Monto: 8000, CuentaOrigen: 'carlos.ahorro', CuentaDestino: '-', Estado: 'completado' },
                { IdTransaccion: 4, Fecha: '2025-01-21 11:45', Tipo: 'pago', Monto: 3500, CuentaOrigen: 'maria.corriente', CuentaDestino: '-', Estado: 'pendiente' },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const columns = [
        { key: 'Fecha', label: 'Fecha y Hora' },
        {
            key: 'Tipo',
            label: 'Tipo',
            render: (val: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val === 'transferencia' ? 'bg-blue-100 text-blue-800' :
                    val === 'deposito' ? 'bg-green-100 text-green-800' :
                        val === 'retiro' ? 'bg-red-100 text-red-800' :
                            'bg-purple-100 text-purple-800'
                    }`}>
                    {val.charAt(0).toUpperCase() + val.slice(1)}
                </span>
            )
        },
        { key: 'CuentaOrigen', label: 'Origen' },
        { key: 'CuentaDestino', label: 'Destino' },
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