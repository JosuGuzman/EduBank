import axios from "axios";

// URL de tu backend (Render)
const API_URL = "https://edubank-1.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // permite enviar/recibir cookies
});

export interface RegisterData {
  Email: string;
  Nombre: string;
  DNI: string;
  Direccion: string;
  Telefono: string;
  IdSucursal: number;
  PasswordHash: string;
}

export const authService = {
  /**
   * 🔐 Iniciar sesión
   * Guarda automáticamente la cookie (HttpOnly) si el backend responde con Set-Cookie
   */
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/usuarios/login", {
        Email: email,
        PasswordHash: password,
      });

      // No hace falta guardar token manualmente: se almacena como cookie HttpOnly
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.error || "Error al iniciar sesión",
      };
    }
  },

  /**
   * 📝 Registro de usuario nuevo
   */
  register: async (data: RegisterData) => {
    try {
      const response = await api.post("/usuarios/register", data);
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.error || "Error al registrarse",
      };
    }
  },

  /**
   * 🚪 Cerrar sesión
   * Llama al backend para eliminar la cookie
   */
  logout: async () => {
    try {
      await api.post("/usuarios/logout");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      window.location.href = "/login";
    }
  },

  /**
   * 👀 Verificar si el usuario está autenticado
   * No se puede leer la cookie HttpOnly con JS, por eso pedimos al backend
   */
  checkAuth: async () => {
    try {
      const response = await api.get("/usuarios/me"); // El backend valida el token
      return { isAuthenticated: true, user: response.data };
    } catch {
      return { isAuthenticated: false, user: null };
    }
  },

  /**
   * 👤 Obtener información del usuario actual
   */
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
