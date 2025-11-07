import axios from 'axios';

const API_URL = "https://edubank-1.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface Auditoria {
  IdAuditoria: number;
  Accion: string;
  Fecha: string;
  Detalle: string;
  IP: string;
  IdUsuario: number;
}

export const auditoriaService = {
  // Obtener todas las auditorías
  getAuditorias: async (): Promise<Auditoria[]> => {
    try {
      const response = await api.get('/auditorias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las auditorías:', error);
      throw error;
    }
  },

  // Obtener una auditoría por ID
  getAuditoriaById: async (id: number): Promise<Auditoria> => {
    try {
      const response = await api.get(`/auditorias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la auditoría con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva auditoría
  createAuditoria: async (auditoriaData: Omit<Auditoria, 'IdAuditoria'>): Promise<Auditoria> => {
    try {
      const response = await api.post('/auditorias', auditoriaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la auditoría:', error);
      throw error;
    }
  },

  // Actualizar una auditoría existente
  updateAuditoria: async (id: number, auditoriaData: Partial<Auditoria>): Promise<Auditoria> => {
    try {
      const response = await api.put(`/auditorias/${id}`, auditoriaData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la auditoría con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una auditoría
  deleteAuditoria: async (id: number): Promise<void> => {
    try {
      await api.delete(`/auditorias/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la auditoría con ID ${id}:`, error);
      throw error;
    }
  }
};

export default auditoriaService;
