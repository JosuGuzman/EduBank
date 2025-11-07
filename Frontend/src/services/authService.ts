import axios from "axios";

const API_URL = "https://edubank-1.onrender.com"; // Ajusta la URL según tu backend

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante para enviar y recibir cookies
});

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

  // Cerrar sesión
  logout: async () => {
    try {
      // Limpiar la cookie del token
      document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      // Redirigir al login
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Asegurarse de redirigir incluso si hay un error
      window.location.href = "/login";
    }
  },

  // Verificar autenticación
  checkAuth: async () => {
    // Solo verificamos si hay un token en las cookies
    const hasToken = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("access_token"));

    console.log("hasToken", hasToken)
      
    return { 
      isAuthenticated: hasToken,
      error: hasToken ? null : "No hay token de autenticación"
    };
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
