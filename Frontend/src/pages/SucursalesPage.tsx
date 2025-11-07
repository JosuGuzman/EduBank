// ==========================================================
// src/pages/SucursalesPage.jsx
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';

interface Sucursal {
    IdSucursal: number;
    Nombre: string;
    Ciudad: string;
    Direccion: string;
    Telefono: string;
    Email: string;
    Estado: boolean;
}

const SucursalesPage = () => {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setSucursales([
                { IdSucursal: 1, Nombre: 'Sucursal Central', Ciudad: 'Buenos Aires', Direccion: 'Av. Siempre Viva 742', Telefono: '011-1234-5678', Email: 'central@banco.com', Estado: true },
                { IdSucursal: 2, Nombre: 'Sucursal Norte', Ciudad: 'Córdoba', Direccion: 'Calle Falsa 123', Telefono: '0351-999-8888', Email: 'norte@banco.com', Estado: true },
                { IdSucursal: 3, Nombre: 'Sucursal Sur', Ciudad: 'Rosario', Direccion: 'San Martín 456', Telefono: '0341-777-6666', Email: 'sur@banco.com', Estado: true },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const columns = [
        { key: 'Nombre', label: 'Nombre' },
        { key: 'Ciudad', label: 'Ciudad' },
        { key: 'Direccion', label: 'Dirección' },
        { key: 'Telefono', label: 'Teléfono' },
        { key: 'Email', label: 'Email' },
        {
            key: 'Estado',
            label: 'Estado',
            render: (val: boolean) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {val ? 'Activa' : 'Inactiva'}
                </span>
            )
        }
    ];

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Sucursales</h1>
                <Button><Plus className="w-4 h-4 mr-2" />Nueva Sucursal</Button>
            </div>
            <Card>
                <Table columns={columns} data={sucursales} onEdit={() => { }} onDelete={() => { }} />
            </Card>
        </div>
    );
};

export default SucursalesPage;
