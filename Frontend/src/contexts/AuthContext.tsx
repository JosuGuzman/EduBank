import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

type User = {
  id_usuario: number;
  email: string;
  nivel_acceso: string;
  nombre?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar autenticación
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      // const { isAuthenticated: isAuth } = await authService.checkAuth();
      const isAuth = true;
      
      if (isAuth && !user) {
        // Si está autenticado pero no tenemos los datos del usuario, los obtenemos
        const { user: userData } = await authService.getCurrentUser();
        if (userData) {
          setUser({
            id_usuario: userData.IdUsuario,
            email: userData.Email,
            nivel_acceso: userData.Rol,
            nombre: userData.Nombre
          });
        }
      }
      
      setIsAuthenticated(isAuth);
      return isAuth;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      
      // Redirigir al dashboard si está autenticado y está en la página de login/register
      if (isAuth && (location.pathname === '/login' || location.pathname === '/register')) {
        navigate('/dashboard');
      }
      
      // Redirigir a login si no está autenticado y no está en una ruta pública
      const publicRoutes = ['/login', '/register', '/'];
      if (!isAuth && !publicRoutes.includes(location.pathname)) {
        navigate('/login');
      }
    };

    verifyAuth();
  }, [checkAuth, navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await authService.login(email, password);

      if (error) {
        throw new Error(error);
      }

      if (data) {
        const { user: userData } = await authService.getCurrentUser();
        if (userData) {
          setUser({
            id_usuario: userData.IdUsuario,
            email: userData.Email,
            nivel_acceso: userData.Rol,
            nombre: userData.Nombre
          });
        }
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;

