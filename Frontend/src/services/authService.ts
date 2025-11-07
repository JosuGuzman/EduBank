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
  apellido: string;
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
    const { confirmPassword, ...registrationData } = userData;

    if (userData.password !== confirmPassword) {
      return {
        error: "Las contraseñas no coinciden",
        status: 400,
      };
    }

    const response = await api.post<{ user: User; token: string }>(
      "/auth/register",
      registrationData
    );

    if (response.data?.token) {
      api.setAuthToken(response.data.token);
    }

    return response;
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const token = api.getAuthToken();
    if (!token) {
      return {
        error: "No hay sesión activa",
        status: 401,
      };
    }

    return api.get<User>("/auth/me", {
      Authorization: `Bearer ${token}`,
    });
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
