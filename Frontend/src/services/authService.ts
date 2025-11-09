import axios from "axios";
import Cookies from "js-cookie";
import { data } from "react-router-dom";
// const API_URL = "https://edubank-1.onrender.com"; // Ajusta la URL según tu backend
const API_URL = "https://edubank-1.onrender.com"; // Ajusta la URL según tu backend

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface RegisterData{
  Email: string,
  Nombre: string,
  DNI: string,
  Direccion: string,
  Telefono: string,
  IdSucursal: number,
  PasswordHash:string
}

export const authService = {
  // Verificar si hay un token en las cookies
  isAuthenticated: (): boolean => {
    return document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("access_token="));
  },

  // Iniciar sesión
  login: async (email: string, password: string) => {
    try {
      console.log("sadasdasdasdasd");
      const response = await api.post("usuarios/login", {
        Email: email,
        PasswordHash: password,
      });
      console.log(response);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  },
  register: async ( data:RegisterData) => {
    console.log("data",data)
    try {
      console.log("si te registraste guacho");
      const response = await api.post("usuarios/register")
      
      console.log("respoenmse",response);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || "Error al registrarse sesión",
      };
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      // Llamamos al backend para borrar la cookie
      await api.post("/usuarios/logout");

      // Redirigir al login
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Redirigir igual al login aunque falle la petición
      window.location.href = "/login";
    }
  },
  // Verificar autenticación
  checkAuth: async () => {
    // Solo verificamos si hay un token en las cookies
    const hasToken = Cookies.get("access_token");
    console.log("hasToken", hasToken);
    return { isAuthenticated: !!hasToken, error: null };
  },

  // Obtener información del usuario autenticado
  getCurrentUser: async () => {
    try {
      const response = await api.get("/usuarios/me");
      return { user: response.data, error: null };
    } catch (error: any) {
      return {
        user: null,
        error: error.response?.data?.message || "Error al obtener el usuario",
      };
    }
  },
};

export default authService;
