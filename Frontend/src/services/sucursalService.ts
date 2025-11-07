import axios from 'axios';

// Usamos la misma URL base que en authService
const API_URL = "https://edubank-1.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface Sucursal {
  IdSucursal: number;
  Nombre: string;
  Ciudad: string;
  Direccion: string;
  Telefono: string;
  Email: string;
  Estado: boolean;
}

export const sucursalService = {
  // Obtener todas las sucursales
  getSucursales: async (): Promise<Sucursal[]> => {
    try {
      const response = await api.get('/sucursales');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las sucursales:', error);
      throw error;
    }
  },

  // Obtener una sucursal por ID
  getSucursalById: async (id: number): Promise<Sucursal> => {
    try {
      const response = await api.get(`/sucursales/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la sucursal con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva sucursal
  createSucursal: async (sucursalData: Omit<Sucursal, 'IdSucursal'>): Promise<Sucursal> => {
    try {
      const response = await api.post('/sucursales', sucursalData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la sucursal:', error);
      throw error;
    }
  },

  // Actualizar una sucursal existente
  updateSucursal: async (id: number, sucursalData: Partial<Sucursal>): Promise<Sucursal> => {
    try {
      const response = await api.put(`/sucursales/${id}`, sucursalData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la sucursal con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una sucursal
  deleteSucursal: async (id: number): Promise<void> => {
    try {
      await api.delete(`/sucursales/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la sucursal con ID ${id}:`, error);
      throw error;
    }
  },

  // Cambiar estado de una sucursal
  toggleSucursalStatus: async (id: number, estado: boolean): Promise<Sucursal> => {
    try {
      const response = await api.put(`/sucursales/${id}`, { Estado: estado });
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar el estado de la sucursal con ID ${id}:`, error);
      throw error;
    }
  }
};

export default sucursalService;
