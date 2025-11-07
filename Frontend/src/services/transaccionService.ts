import axios from "axios";

const API_URL = "https://edubank-1.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

interface CuentaDetalles {
  IdCuenta: number;
  CBU: string;
  Alias: string;
  Saldo: number;
  FechaApertura: string;
  Activa: boolean;
  usuario: UsuarioDetalles;
  tipoCuenta: TipoCuentaDetalles;
  sucursal: SucursalDetalles;
}

interface UsuarioDetalles {
  IdUsuario: number;
  Nombre: string;
  DNI: string;
  Email: string;
  Telefono: string;
  Direccion: string;
  Rol: string;
  FechaAlta: string;
  Activo: boolean;
  sucursal: SucursalDetalles;
}

interface TipoCuentaDetalles {
  Nombre: string;
  Descripcion: string;
  permiteCredito: boolean;
  moneda: string;
  TasaInteres: number;
}

interface SucursalDetalles {
  Nombre: string;
  Ciudad: string;
  Direccion: string;
  Telefono: string;
  Email: string;
  Estado: boolean;
}

export interface TipoTransaccion {
  IdTipoTransaccion: number;
  Nombre: string;
  Descripcion: string;
}

export type EstadoTransaccion = 'pendiente' | 'completada' | 'rechazada' | 'cancelada';

export interface Transaccion {
  Fecha: string;
  Tipo: TipoTransaccion;
  Monto: number;
  Estado: EstadoTransaccion;
  cuentaOrigen?: CuentaDetalles;
  cuentaDestino?: CuentaDetalles;
}

export const transaccionService = {
  // Obtener todas las transacciones
  getTransacciones: async (): Promise<Transaccion[]> => {
    try {
      const response = await api.get("/transacciones");
      return response.data;
    } catch (error) {
      console.error("Error al obtener las transacciones:", error);
      throw error;
    }
  },

  // Obtener transacciones por cuenta
  getTransaccionesByCuenta: async (
    idCuenta: number
  ): Promise<Transaccion[]> => {
    try {
      const response = await api.get(`/transacciones?cuenta=${idCuenta}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error al obtener las transacciones de la cuenta ${idCuenta}:`,
        error
      );
      throw error;
    }
  },

  // Obtener una transacción por ID
  getTransaccionById: async (id: number): Promise<Transaccion> => {
    try {
      const response = await api.get(`/transacciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la transacción con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva transacción
  createTransaccion: async (
    transaccionData: Omit<Transaccion, "IdTransaccion" | "Fecha" | "Estado">
  ): Promise<Transaccion> => {
    try {
      const response = await api.post("/transacciones", {
        ...transaccionData,
        Fecha: new Date().toISOString(),
        Estado: "pendiente",
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear la transacción:", error);
      throw error;
    }
  },

  // Actualizar una transacción existente
  updateTransaccion: async (
    id: number,
    transaccionData: Partial<Transaccion>
  ): Promise<Transaccion> => {
    try {
      const response = await api.put(`/transacciones/${id}`, transaccionData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la transacción con ID ${id}:`, error);
      throw error;
    }
  },

  // Aprobar una transacción
  aprobarTransaccion: async (id: number): Promise<Transaccion> => {
    try {
      const response = await api.put(`/transacciones/${id}`, {
        Estado: "completada",
      });
      return response.data;
    } catch (error) {
      console.error(`Error al aprobar la transacción con ID ${id}:`, error);
      throw error;
    }
  },

  // Rechazar una transacción
  rechazarTransaccion: async (id: number): Promise<Transaccion> => {
    try {
      const response = await api.put(`/transacciones/${id}`, {
        Estado: "rechazada",
      });
      return response.data;
    } catch (error) {
      console.error(`Error al rechazar la transacción con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una transacción
  deleteTransaccion: async (id: number): Promise<void> => {
    try {
      await api.delete(`/transacciones/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la transacción con ID ${id}:`, error);
      throw error;
    }
  },
};

export default transaccionService;
