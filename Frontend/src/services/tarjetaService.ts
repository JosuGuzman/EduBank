import axios from 'axios';

const API_URL = "https://edubank-1.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export type TipoTarjeta = 'credito' | 'debito';
export type EstadoTarjeta = 'activa' | 'inactiva' | 'bloqueada' | 'vencida';

export interface Tarjeta {
  IdTarjeta: number;
  IdCuenta: number;
  NumeroTarjeta: string;
  Titular: string;
  FechaVencimiento: string;
  CVV: string;
  Tipo: TipoTarjeta;
  LimiteCredito?: number;
  SaldoActual?: number;
  Estado: EstadoTarjeta;
  FechaEmision: string;
}

export const tarjetaService = {
  // Obtener todas las tarjetas
  getTarjetas: async (): Promise<Tarjeta[]> => {
    try {
      const response = await api.get('/tarjetas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las tarjetas:', error);
      throw error;
    }
  },

  // Obtener una tarjeta por ID
  getTarjetaById: async (id: number): Promise<Tarjeta> => {
    try {
      const response = await api.get(`/tarjetas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la tarjeta con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener tarjetas por cuenta
  getTarjetasByCuenta: async (idCuenta: number): Promise<Tarjeta[]> => {
    try {
      const response = await api.get(`/tarjetas?IdCuenta=${idCuenta}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener las tarjetas de la cuenta ${idCuenta}:`, error);
      throw error;
    }
  },

  // Crear una nueva tarjeta
  createTarjeta: async (tarjetaData: Omit<Tarjeta, 'IdTarjeta' | 'FechaEmision'>): Promise<Tarjeta> => {
    try {
      const response = await api.post('/tarjetas', {
        ...tarjetaData,
        FechaEmision: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear la tarjeta:', error);
      throw error;
    }
  },

  // Actualizar una tarjeta existente
  updateTarjeta: async (id: number, tarjetaData: Partial<Tarjeta>): Promise<Tarjeta> => {
    try {
      const response = await api.put(`/tarjetas/${id}`, tarjetaData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la tarjeta con ID ${id}:`, error);
      throw error;
    }
  },

  // Bloquear una tarjeta
  bloquearTarjeta: async (id: number): Promise<Tarjeta> => {
    try {
      const response = await api.put(`/tarjetas/${id}`, {
        Estado: 'bloqueada'
      });
      return response.data;
    } catch (error) {
      console.error(`Error al bloquear la tarjeta con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una tarjeta
  deleteTarjeta: async (id: number): Promise<void> => {
    try {
      await api.delete(`/tarjetas/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la tarjeta con ID ${id}:`, error);
      throw error;
    }
  }
};

export default tarjetaService;
