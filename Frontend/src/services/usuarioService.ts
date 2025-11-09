import axios from 'axios';

const API_URL = "http://localhost:3000";

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
