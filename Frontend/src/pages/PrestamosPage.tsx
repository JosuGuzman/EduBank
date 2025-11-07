
// ==========================================================
// src/pages/PrestamosPage.jsx
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';

interface Prestamo {
    IdPrestamo: number;
    Usuario: string;
    Monto: number;
    TasaInteres: number;
    PlazoMeses: number;
    CuotaMensual: number;
    FechaInicio: string;
    Estado: string;
}

const PrestamosPage = () => {
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setPrestamos([
                { IdPrestamo: 1, Usuario: 'Juan Pérez', Monto: 200000, TasaInteres: 10.5, PlazoMeses: 24, CuotaMensual: 9458, FechaInicio: '2025-01-01', Estado: 'aprobado' },
                { IdPrestamo: 2, Usuario: 'María López', Monto: 150000, TasaInteres: 12, PlazoMeses: 36, CuotaMensual: 4983, FechaInicio: '2025-01-15', Estado: 'pendiente' },
                { IdPrestamo: 3, Usuario: 'Carlos García', Monto: 300000, TasaInteres: 9.5, PlazoMeses: 48, CuotaMensual: 7632, FechaInicio: '2024-12-10', Estado: 'aprobado' },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const columns = [
        { key: 'Usuario', label: 'Cliente' },
        {
            key: 'Monto',
            label: 'Monto',
            render: (val: number) => <span className="font-semibold text-gray-900">${val.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
        },
        {
            key: 'TasaInteres',
            label: 'Tasa',
            render: (val: number) => <span className="font-medium">{val}%</span>
        },
        {
            key: 'PlazoMeses',
            label: 'Plazo',
            render: (val: number) => <span>{val} meses</span>
        },
        {
            key: 'CuotaMensual',
            label: 'Cuota',
            render: (val: number) => <span className="font-semibold text-blue-600">${val.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
        },
        {
            key: 'Estado',
            label: 'Estado',
            render: (val: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val === 'aprobado' ? 'bg-green-100 text-green-800' :
                    val === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        val === 'rechazado' ? 'bg-red-100 text-red-800' :
                            val === 'pagado' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
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
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Préstamos</h1>
                <Button><Plus className="w-4 h-4 mr-2" />Nuevo Préstamo</Button>
            </div>
            <Card>
                <Table columns={columns} data={prestamos} onEdit={() => { }} onDelete={() => { }} />
            </Card>
        </div>
    );
};

export default PrestamosPage;