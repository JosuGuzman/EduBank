// src/pages/CuentasPage.jsx
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';

interface Cuenta {
    IdCuenta: number;
    CBU: string;
    Alias: string;
    Saldo: number;
    Usuario: string;
    TipoCuenta: string;
    Activa: boolean;
}

const CuentasPage = () => {
    const [cuentas, setCuentas] = useState<Cuenta[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Datos de ejemplo
        setTimeout(() => {
            setCuentas([
                { IdCuenta: 1, CBU: '0000003100012345678901', Alias: 'juan.ahorro', Saldo: 150000, Usuario: 'Juan Pérez', TipoCuenta: 'Caja de Ahorro', Activa: true },
                { IdCuenta: 2, CBU: '0000003200012345678902', Alias: 'maria.corriente', Saldo: 85000, Usuario: 'María López', TipoCuenta: 'Cuenta Corriente', Activa: true },
                { IdCuenta: 3, CBU: '0000003300012345678903', Alias: 'carlos.ahorro', Saldo: 220000, Usuario: 'Carlos García', TipoCuenta: 'Caja de Ahorro', Activa: true },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const columns = [
        { key: 'Alias', label: 'Alias' },
        { key: 'CBU', label: 'CBU' },
        { key: 'Usuario', label: 'Titular' },
        { key: 'TipoCuenta', label: 'Tipo' },
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
