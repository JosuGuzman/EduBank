import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { User } from '../services/authService';

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
    confirmPassword: string;
  }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user data when the app starts
  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authService.getCurrentUser();
      
      if (response.data) {
        setUser(response.data);
      } else {
        authService.logout();
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user is already logged in on initial load
  useEffect(() => {
    if (authService.isAuthenticated()) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data?.user) {
        setUser(response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data?.user) {
        setUser(response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
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
        loadUser,
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
