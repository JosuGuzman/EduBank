const API_BASE_URL = 'https://edubank-1.onrender.com/'; // Update with your backend URL

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export const api = {
  async request<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    headers: Record<string, string> = {},
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include', // Important for cookies/sessions
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const responseData = await response.json().catch(() => ({}));

      console.log(response)

      if (!response.ok) {
        return {
          error: responseData.message || 'Error en la solicitud',
          status: response.status,
        };
      }

      return {
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: 'Error de conexión. Por favor, intenta nuevamente.',
        status: 500,
      };
    }
  },

  // Helper methods for different HTTP methods
  get<T = any>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, 'GET', undefined, headers);
  },

  post<T = any>(endpoint: string, data?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, 'POST', data, headers);
  },

  put<T = any>(endpoint: string, data?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, 'PUT', data, headers);
  },

  delete<T = any>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, 'DELETE', undefined, headers);
  },

  // Add auth token to requests
  setAuthToken(token: string) {
    localStorage.setItem('token', token);
  },

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  },

  removeAuthToken() {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  },
};
