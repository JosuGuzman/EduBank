import axios from 'axios';

const API_URL = "https://edubank-1.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export type EstadoPrestamo = 'solicitado' | 'aprobado' | 'rechazado' | 'cancelado' | 'pagado';

export interface Prestamo {
  IdPrestamo: number;
  IdUsuario: number;
  Monto: number;
  TasaInteres: number;
  PlazoMeses: number;
  Estado: EstadoPrestamo;
  FechaSolicitud: string;
  FechaAprobacion?: string;
  FechaInicio?: string;
  FechaFin?: string;
  CuotaMensual: number;
}

export const prestamoService = {
  // Obtener todos los préstamos
  getPrestamos: async (): Promise<Prestamo[]> => {
    try {
      const response = await api.get('/prestamos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los préstamos:', error);
      throw error;
    }
  },

  // Obtener un préstamo por ID
  getPrestamoById: async (id: number): Promise<Prestamo> => {
    try {
      const response = await api.get(`/prestamos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el préstamo con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo préstamo
  createPrestamo: async (prestamoData: Omit<Prestamo, 'IdPrestamo' | 'FechaSolicitud'>): Promise<Prestamo> => {
    try {
      const response = await api.post('/prestamos', {
        ...prestamoData,
        FechaSolicitud: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear el préstamo:', error);
      throw error;
    }
  },

  // Actualizar un préstamo existente
  updatePrestamo: async (id: number, prestamoData: Partial<Prestamo>): Promise<Prestamo> => {
    try {
      const response = await api.put(`/prestamos/${id}`, prestamoData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el préstamo con ID ${id}:`, error);
      throw error;
    }
  },

  // Aprobar un préstamo
  aprobarPrestamo: async (id: number): Promise<Prestamo> => {
    try {
      const response = await api.put(`/prestamos/${id}`, {
        Estado: 'aprobado',
        FechaAprobacion: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error(`Error al aprobar el préstamo con ID ${id}:`, error);
      throw error;
    }
  },

  // Rechazar un préstamo
  rechazarPrestamo: async (id: number): Promise<Prestamo> => {
    try {
      const response = await api.put(`/prestamos/${id}`, {
        Estado: 'rechazado'
      });
      return response.data;
    } catch (error) {
      console.error(`Error al rechazar el préstamo con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un préstamo
  deletePrestamo: async (id: number): Promise<void> => {
    try {
      await api.delete(`/prestamos/${id}`);
    } catch (error) {
      console.error(`Error al eliminar el préstamo con ID ${id}:`, error);
      throw error;
    }
  }
};

export default prestamoService;
