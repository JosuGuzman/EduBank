import axios from 'axios';

const API_URL = "https://edubank-1.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface TipoCuenta {
  IdTipoCuenta: number;
  Nombre: string;
  Descripcion: string;
  PermiteCredito: boolean;
  Moneda: string;
  TasaInteres: number;
}

export const tipoCuentaService = {
  // Obtener todos los tipos de cuenta
  getTiposCuenta: async (): Promise<TipoCuenta[]> => {
    try {
      const response = await api.get('/tiposCuentas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los tipos de cuenta:', error);
      throw error;
    }
  },

  // Obtener un tipo de cuenta por ID
  getTipoCuentaById: async (id: number): Promise<TipoCuenta> => {
    try {
      const response = await api.get(`/tiposCuentas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el tipo de cuenta con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo tipo de cuenta
  createTipoCuenta: async (tipoCuentaData: Omit<TipoCuenta, 'IdTipoCuenta'>): Promise<TipoCuenta> => {
    try {
      const response = await api.post('/tiposCuentas', tipoCuentaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el tipo de cuenta:', error);
      throw error;
    }
  },

  // Actualizar un tipo de cuenta existente
  updateTipoCuenta: async (id: number, tipoCuentaData: Partial<TipoCuenta>): Promise<TipoCuenta> => {
    try {
      const response = await api.put(`/tiposCuentas/${id}`, tipoCuentaData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el tipo de cuenta con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un tipo de cuenta
  deleteTipoCuenta: async (id: number): Promise<void> => {
    try {
      await api.delete(`/tiposCuentas/${id}`);
    } catch (error) {
      console.error(`Error al eliminar el tipo de cuenta con ID ${id}:`, error);
      throw error;
    }
  }
};

export default tipoCuentaService;
