import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type User = {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  // Add other user fields as needed
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Replace with actual token verification
        const token = localStorage.getItem('token');
        if (token) {
          // Simulate token verification
          await new Promise(resolve => setTimeout(resolve, 500));
          // For demo purposes, we'll just set a mock user
          setUser({
            id: '1',
            email: 'demo@edubank.com',
            nombre: 'Demo',
            apellido: 'User'
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      console.log('Login attempt with:', { email, password });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser = {
        id: '1',
        email,
        nombre: 'Demo',
        apellido: 'User'
      };
      
      setUser(mockUser);
      localStorage.setItem('token', 'dummy-token');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      console.log('Registration attempt with:', userData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const mockUser = {
        id: '1',
        email: userData.email,
        nombre: userData.nombre,
        apellido: userData.apellido
      };
      
      setUser(mockUser);
      localStorage.setItem('token', 'dummy-token');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Error al crear la cuenta. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
