// ==========================================================
// src/pages/UsuariosPage.jsx
import { useState, useEffect } from 'react';
import { Plus, User } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';
import { Input } from '../components/UI/Input';
import { Modal } from '../components/UI/Modal';
import { Select } from '../components/UI/Select';


interface Usuario {
  IdUsuario: number;
  Nombre: string;
  DNI: string;
  Email: string;
  Rol: string;
  Activo: boolean;
  Direccion?: string;
  PasswordHash?: string;
  Telefono?: string;
  IdSucursal?: string;
  FechaAlta?: string;
}

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<Usuario>({
    IdUsuario: 0,
    Nombre: '',
    DNI: '',
    Email: '',
    Telefono: '',
    Direccion: '',
    Rol: 'cliente',
    PasswordHash: '',
    IdSucursal: '1',
    FechaAlta: new Date().toISOString(),
    Activo: true
  });

  // Cargar usuarios
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      // Descomenta para usar tu API
      // const response = await axios.get('http://localhost:3000/usuarios');
      // setUsuarios(response.data);

      // Datos de ejemplo
      setUsuarios([
        { IdUsuario: 1, Nombre: 'Juan Pérez', DNI: '40123456', Email: 'juan@mail.com', Rol: 'cliente', Activo: true },
        { IdUsuario: 2, Nombre: 'María López', DNI: '38999888', Email: 'maria@mail.com', Rol: 'empleado', Activo: true },
        { IdUsuario: 3, Nombre: 'Carlos García', DNI: '37555111', Email: 'carlos@mail.com', Rol: 'gerente', Activo: true },
      ]);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'Nombre',
      label: 'Nombre',
      render: (val: string, row: Usuario) => (
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
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val === 'admin' ? 'bg-red-100 text-red-800' :
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
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {val ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ];

  const handleEdit = (user: Usuario) => {
    setCurrentUser(user);
    setFormData({
      ...user,
      PasswordHash: '',
      IdSucursal: user.IdSucursal || '1',
      FechaAlta: user.FechaAlta || new Date().toISOString()
    });
    setShowModal(true);
  };

  const handleDelete = async (user: Usuario) => {
    if (!window.confirm(`¿Está seguro de eliminar a ${user.Nombre}?`)) {
      return;
    }

    try {
      // Descomenta para usar tu API
      // await axios.delete(`http://localhost:3000/usuarios/${user.IdUsuario}`);

      setUsuarios(usuarios.filter(u => u.IdUsuario !== user.IdUsuario));
      alert('Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar usuario');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (currentUser) {
        // Actualizar usuario
        // await axios.put(`http://localhost:3000/usuarios/${currentUser.IdUsuario}`, formData);

        setUsuarios(usuarios.map(u =>
          u.IdUsuario === currentUser.IdUsuario
            ? { ...formData, IdUsuario: currentUser.IdUsuario }
            : u
        ));
        alert('Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        // const response = await axios.post('http://localhost:3000/usuarios/register', formData);

        const newUser = {
          ...formData,
          IdUsuario: Date.now(),
          Activo: true
        };
        setUsuarios([...usuarios, newUser]);
        alert('Usuario creado correctamente');
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert('Error al guardar usuario');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
    setFormData({
      IdUsuario: 0,
      Nombre: '',
      DNI: '',
      Email: '',
      Telefono: '',
      Direccion: '',
      Rol: 'cliente',
      PasswordHash: '',
      IdSucursal: '1',
      FechaAlta: new Date().toISOString(),
      Activo: true
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={usuarios}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={currentUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Nombre Completo"
            name="Nombre"
            label="Nombre Completo"
            value={formData.Nombre}
            onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="DNI"
            name="DNI"
            label="DNI"
            value={formData.DNI}
            onChange={(e) => setFormData({ ...formData, DNI: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            name="Email"
            label="Email"
            value={formData.Email}
            onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Teléfono"
            name="Telefono"
            label="Teléfono"
            value={formData.Telefono || ''}
            onChange={(e) => setFormData({ ...formData, Telefono: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Dirección"
            name="Direccion"
            label="Dirección"
            value={formData.Direccion || ''}
            onChange={(e) => setFormData({ ...formData, Direccion: e.target.value })}
          />
          <Select
            name="Rol"
            label="Rol"
            value={formData.Rol}
            onChange={(e) => setFormData({ ...formData, Rol: e.target.value })}
            options={[
              { value: 'cliente', label: 'Cliente' },
              { value: 'empleado', label: 'Empleado' },
              { value: 'gerente', label: 'Gerente' },
              { value: 'admin', label: 'Administrador' }
            ]}
            required
          />
          {!currentUser && (
            <Input
              type="password"
              placeholder="Contraseña"
              name="PasswordHash"
              label="Contraseña"
              value={formData.PasswordHash || ''}
              onChange={(e) => setFormData({ ...formData, PasswordHash: e.target.value })}
              required
            />
          )}
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsuariosPage;