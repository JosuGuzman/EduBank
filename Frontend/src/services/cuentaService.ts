import axios from 'axios';

const API_URL = "https://edubank-1.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface Sucursal {
  Nombre: string;
  Ciudad: string;
  Direccion: string;
  Telefono: string;
  Email: string;
  Estado: boolean;
}

export interface Usuario {
  IdUsuario: number;
  Nombre: string;
  DNI: string;
  Email: string;
  Telefono: string;
  Direccion: string;
  Rol: string;
  FechaAlta: string;
  Activo: boolean;
  sucursal: Sucursal;
}

export interface TipoCuenta {
  Nombre: string;
  Descripcion: string;
  permiteCredito: boolean;
  moneda: string;
  TasaInteres: number;
}

export interface Cuenta {
  IdCuenta: number;
  CBU: string;
  Alias: string;
  Saldo: number;
  FechaApertura: string;
  Activa: boolean;
  usuario: Usuario;
  tipoCuenta: TipoCuenta;
  sucursal: Sucursal;
}

export const cuentaService = {
  // Obtener todas las cuentas
  getCuentas: async (): Promise<Cuenta[]> => {
    try {
      const response = await api.get('/cuentas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las cuentas:', error);
      throw error;
    }
  },

  // Obtener una cuenta por ID
  getCuentaById: async (id: number): Promise<Cuenta> => {
    try {
      const response = await api.get(`/cuentas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la cuenta con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva cuenta
  createCuenta: async (cuentaData: Omit<Cuenta, 'IdCuenta'>): Promise<Cuenta> => {
    try {
      const response = await api.post('/cuentas', cuentaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la cuenta:', error);
      throw error;
    }
  },

  // Actualizar una cuenta existente
  updateCuenta: async (id: number, cuentaData: Partial<Cuenta>): Promise<Cuenta> => {
    try {
      const response = await api.put(`/cuentas/${id}`, cuentaData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la cuenta con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una cuenta
  deleteCuenta: async (id: number): Promise<void> => {
    try {
      await api.delete(`/cuentas/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la cuenta con ID ${id}:`, error);
      throw error;
    }
  }
};

export default cuentaService;
