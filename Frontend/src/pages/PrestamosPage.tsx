
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';
import { prestamoService, type Prestamo} from '../services/prestamoService';
import { usuarioService, type Usuario } from '../services/usuarioService';

interface PrestamoConUsuario extends Omit<Prestamo, 'IdUsuario' | 'FechaSolicitud' | 'FechaAprobacion' | 'FechaInicio' | 'FechaFin'> {
    Usuario: string;
    FechaInicio: string;
}

const PrestamosPage = () => {
    const [prestamos, setPrestamos] = useState<PrestamoConUsuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const [usuarios, setUsuarios] = useState<Record<number, Usuario>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener préstamos y usuarios en paralelo
                const [prestamosData, usuariosData] = await Promise.all([
                    prestamoService.getPrestamos(),
                    usuarioService.getUsuarios()
                ]);

                // Crear un mapa de usuarios por ID
                const usuariosMap = usuariosData.reduce((acc, usuario) => {
                    acc[usuario.IdUsuario] = usuario;
                    return acc;
                }, {} as Record<number, Usuario>);

                // setUsuarios(usuariosMap);

                // Mapear préstamos para incluir el nombre del usuario
                const prestamosConUsuario = prestamosData.map(prestamo => ({
                    ...prestamo,
                    Usuario: usuariosMap[prestamo.IdUsuario]?.Nombre || 'Usuario desconocido',
                    FechaInicio: prestamo.FechaInicio || prestamo.FechaSolicitud
                }));

                setPrestamos(prestamosConUsuario);
                setError(null);
            } catch (err) {
                console.error('Error al cargar los préstamos:', err);
                setError('No se pudieron cargar los préstamos. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
    
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
    </div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Préstamos</h1>
                <Button onClick={() => {}}><Plus className="w-4 h-4 mr-2" />Nuevo Préstamo</Button>
            </div>
            <Card>
                <Table 
                    columns={columns} 
                    data={prestamos} 
                    onEdit={(prestamo) => {
                        // Implementar lógica de edición
                        console.log('Editar préstamo:', prestamo);
                    }} 
                    onDelete={async (prestamo) => {
                        if (window.confirm(`¿Está seguro de que desea eliminar el préstamo #${prestamo.IdPrestamo}?`)) {
                            try {
                                await prestamoService.deletePrestamo(prestamo.IdPrestamo);
                                setPrestamos(prestamos.filter(p => p.IdPrestamo !== prestamo.IdPrestamo));
                            } catch (err) {
                                console.error('Error al eliminar el préstamo:', err);
                                alert('No se pudo eliminar el préstamo. Por favor, intente nuevamente.');
                            }
                        }
                    }} 
                />
            </Card>
        </div>
    );
};

export default PrestamosPage;