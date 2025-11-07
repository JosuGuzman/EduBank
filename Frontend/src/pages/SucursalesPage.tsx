import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';
import { sucursalService, type Sucursal } from '../services/sucursalService';


const SucursalesPage = () => {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                const data = await sucursalService.getSucursales();
                setSucursales(data);
                setError(null);
            } catch (err) {
                console.error('Error al cargar las sucursales:', err);
                setError('No se pudieron cargar las sucursales. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchSucursales();
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
