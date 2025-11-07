import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';
import { usuarioService, type Usuario } from '../services/usuarioService';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const data = await usuarioService.getUsuarios();
        setUsuarios(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
        setError('No se pudieron cargar los usuarios. Intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const columns = [
    {
      key: 'Nombre',
      label: 'Nombre',
      render: (val: string) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-medium">{val}</span>
        </div>
      )
    },
    { key: 'DNI', label: 'DNI' },
    { key: 'Email', label: 'Email' },
    {
      key: 'Rol',
      label: 'Rol',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          val === 'admin' ? 'bg-red-100 text-red-800' :
          val === 'gerente' ? 'bg-purple-100 text-purple-800' :
          val === 'empleado' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {val.charAt(0).toUpperCase() + val.slice(1)}
        </span>
      )
    },
    {
      key: 'Activo',
      label: 'Estado',
      render: (val: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          val ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {val ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lista de Usuarios</h1>
      <Card>
        <Table
          columns={columns}
          data={usuarios}
        />
      </Card>
    </div>
  );
};

export default UsuariosPage;