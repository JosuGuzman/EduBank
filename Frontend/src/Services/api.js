import axios from 'axios';

const API_BASE = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);

export const usuarioService = {
  listar: () => api.get('/usuarios'),
  obtener: (id) => api.get(`/usuarios/${id}`),
  crear: (datos) => api.post('/usuarios', datos),
  actualizar: (id, datos) => api.put(`/usuarios/${id}`, datos),
  eliminar: (id) => api.delete(`/usuarios/${id}`),
};

export const cuentaService = {
  listar: () => api.get('/cuentas'),
  obtener: (id) => api.get(`/cuentas/${id}`),
  crear: (datos) => api.post('/cuentas', datos),
  actualizar: (id, datos) => api.put(`/cuentas/${id}`, datos),
  eliminar: (id) => api.delete(`/cuentas/${id}`),
};

export const transaccionService = {
  listar: () => api.get('/transacciones'),
  obtener: (id) => api.get(`/transacciones/${id}`),
  crear: (datos) => api.post('/transacciones', datos),
  eliminar: (id) => api.delete(`/transacciones/${id}`),
};

export const tarjetaService = {
  listar: () => api.get('/tarjetas'),
  obtener: (id) => api.get(`/tarjetas/${id}`),
  crear: (datos) => api.post('/tarjetas', datos),
  actualizar: (id, datos) => api.put(`/tarjetas/${id}`, datos),
  eliminar: (id) => api.delete(`/tarjetas/${id}`),
  listarPorCuenta: (idCuenta) => api.get(`/tarjetas/cuenta/${idCuenta}`),
};

export const prestamoService = {
  listar: () => api.get('/prestamos'),
  obtener: (id) => api.get(`/prestamos/${id}`),
  crear: (datos) => api.post('/prestamos', datos),
  actualizar: (id, datos) => api.put(`/prestamos/${id}`, datos),
  eliminar: (id) => api.delete(`/prestamos/${id}`),
};

export const sucursalService = {
  listar: () => api.get('/sucursales'),
  obtener: (id) => api.get(`/sucursales/${id}`),
  crear: (datos) => api.post('/sucursales', datos),
  actualizar: (id, datos) => api.put(`/sucursales/${id}`, datos),
  eliminar: (id) => api.delete(`/sucursales/${id}`),
};

export const tipoCuentaService = {
  listar: () => api.get('/tiposCuentas'),
  obtener: (id) => api.get(`/tiposCuentas/${id}`),
  crear: (datos) => api.post('/tiposCuentas', datos),
  actualizar: (id, datos) => api.put(`/tiposCuentas/${id}`, datos),
  eliminar: (id) => api.delete(`/tiposCuentas/${id}`),
};