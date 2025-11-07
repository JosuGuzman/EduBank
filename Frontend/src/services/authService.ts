import { api } from "./api";
import type { ApiResponse } from "./api";

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  // Add other user fields as needed
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  nombre: string;
  dni: string;
  telefono: string;
  direccion: string;
  password: string;
  idSucursal: number;
  confirmPassword: string;
}

export const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await api.post<{ user: User; token: string }>(
      "/usuarios/login",
      {
        Email: credentials.email,
        PasswordHash: credentials.password,
      }
    );

    if (response.data?.token) {
      api.setAuthToken(response.data.token);
    }

    return response;
  },

async register(
  userData: RegisterData
): Promise<ApiResponse<{ user: User; token: string }>> {
  if (userData.password !== userData.confirmPassword) {
    return {
      error: "Las contraseñas no coinciden",
      status: 400,
    };
  }

  const payload = {
    Nombre: userData.nombre,
    Email: userData.email,
    PasswordHash: userData.password,
    DNI: userData.dni,
    Telefono: userData.telefono,
    Direccion: userData.direccion,
    IdSucursal: userData.idSucursal,
  };

  try {
    const response = await api.post<{ user: User; token: string }>("/usuarios/register", payload);

    if (response.data?.token) {
      api.setAuthToken(response.data.token);
    }

    return response;
  } catch (err: any) {
    return {
      error: err.response?.data?.message || "Error al registrar usuario",
      status: err.response?.status || 500,
    };
  }
},


  logout(): void {
    api.removeAuthToken();
    // Optional: Make API call to invalidate token on the server
    // await api.post('/auth/logout');
  },

  isAuthenticated(): boolean {
    return api.isAuthenticated();
  },

  getAuthHeader(): { Authorization: string } | {} {
    const token = api.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
