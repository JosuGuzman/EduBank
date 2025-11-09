import axios from 'axios';

const API_URL = "https://edubank-1.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export type RolUsuario = 'admin' | 'empleado' | 'cliente';

export interface Usuario {
  IdUsuario: number;
  Nombre: string;
  DNI: string;
  Email: string;
  Telefono: string;
  Direccion: string;
  IdSucursal?: number;
}

export interface LoginData {
  Email: string;
  PasswordHash: string;
}

export interface RegisterData {
  Nombre: string;
  DNI: string;
  Email: string;
  Telefono: string;
  Direccion: string;
  PasswordHash: string;
  FechaNacimiento?: string;
  Genero?: string;
  IdSucursal?: number;
}

export const usuarioService = {
  // Obtener todos los usuarios
  getUsuarios: async (): Promise<Usuario[]> => {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw error;
    }
  },

  // Obtener un usuario por ID
  getUsuarioById: async (id: number): Promise<Usuario> => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el usuario con ID ${id}:`, error);
      throw error;
    }
  },

  // Registrar un nuevo usuario
  register: async (userData: RegisterData): Promise<Usuario> => {
    try {
      const response = await api.post('/usuarios/register', {
        ...userData,
        Rol: 'cliente', // Por defecto, los nuevos usuarios son clientes
        FechaAlta: new Date().toISOString(),
        Activo: true
      });
      return response.data;
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error;
    }
  },

  // Iniciar sesión
  login: async (credentials: LoginData): Promise<{ usuario: Usuario; token: string }> => {
    try {
      const response = await api.post('/usuarios/login', credentials);
      // Guardar el token en las cookies automáticamente por withCredentials
      return response.data;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  },

  // Cerrar sesión
  logout: async (): Promise<void> => {
    try {
      await api.post('/usuarios/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  },

  // Actualizar un usuario existente
  updateUsuario: async (id: number, userData: Partial<Usuario>): Promise<Usuario> => {
    try {
      const response = await api.put(`/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el usuario con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un usuario (desactivar)
  deleteUsuario: async (id: number): Promise<void> => {
    try {
      await api.delete(`/usuarios/${id}`);
    } catch (error) {
      console.error(`Error al eliminar el usuario con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener el perfil del usuario actual
  getPerfil: async (): Promise<Usuario> => {
    try {
      const response = await api.get('/usuarios/perfil');
      return response.data;
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      throw error;
    }
  },

  // Actualizar contraseña
  cambiarPassword: async (id: number, oldPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.put(`/usuarios/${id}/cambiar-password`, {
        oldPassword,
        newPassword
      });
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      throw error;
    }
  }
};

export default usuarioService;
