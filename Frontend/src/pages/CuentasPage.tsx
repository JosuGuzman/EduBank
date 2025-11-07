import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';
import { cuentaService, type Cuenta } from '../services/cuentaService';

interface CuentaTabla extends Omit<Cuenta, 'usuario' | 'tipoCuenta' | 'sucursal' | 'FechaApertura'> {
    Usuario: string;
    TipoCuenta: string;
    Sucursal: string;
}

const CuentasPage = () => {
    const [cuentas, setCuentas] = useState<CuentaTabla[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCuentas = async () => {
            try {
                const data = await cuentaService.getCuentas();
                const cuentasFormateadas: CuentaTabla[] = data.map(cuenta => ({
                    IdCuenta: cuenta.IdCuenta,
                    CBU: cuenta.CBU,
                    Alias: cuenta.Alias,
                    Saldo: cuenta.Saldo,
                    Activa: cuenta.Activa,
                    Usuario: cuenta.usuario?.Nombre || 'Sin titular',
                    TipoCuenta: cuenta.tipoCuenta?.Nombre || 'Sin tipo',
                    Sucursal: cuenta.sucursal?.Nombre || 'Sin sucursal'
                }));
                setCuentas(cuentasFormateadas);
                setError(null);
            } catch (err) {
                console.error('Error al cargar las cuentas:', err);
                setError('No se pudieron cargar las cuentas. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchCuentas();
    }, []);

    const columns = [
        { key: 'Alias', label: 'Alias' },
        { key: 'CBU', label: 'CBU' },
        { key: 'Usuario', label: 'Titular' },
        { key: 'TipoCuenta', label: 'Tipo de Cuenta' },
        { key: 'Sucursal', label: 'Sucursal' },
        {
            key: 'Saldo',
            label: 'Saldo',
            render: (val: number) => (
                <span className="font-semibold text-green-600">
                    ${val.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
            )
        },
        {
            key: 'Activa',
            label: 'Estado',
            render: (val: boolean) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {val ? 'Activa' : 'Inactiva'}
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
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Cuentas</h1>
                <Button><Plus className="w-4 h-4 mr-2" />Nueva Cuenta</Button>
            </div>
            <Card>
                <Table columns={columns} data={cuentas} onEdit={() => { }} onDelete={() => { }} />
            </Card>
        </div>
    );
};

export default CuentasPage;
