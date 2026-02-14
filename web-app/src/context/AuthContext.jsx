import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authService.getCurrentUser();
        const userData = response.user || response;
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('[AuthContext] checkAuth error:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    }
  };

  const adminLogin = async (credentials) => {
    try {
      const data = await authService.adminLogin(credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error('[AuthContext] Admin login error:', error);
      throw error;
    }
  };

  const auditorLogin = async (credentials) => {
    try {
      const data = await authService.auditorLogin(credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error('[AuthContext] Auditor login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const googleLogin = async (idToken) => {
    try {
      const data = await authService.googleLogin(idToken);
      
      // Store token first
      localStorage.setItem('token', data.token);

      
      // Update state synchronously to ensure ProtectedRoute sees the changes
      setUser(data.user);
      setIsAuthenticated(true);
      setLoading(false); // Ensure loading is false
      
      return data;
    } catch (error) {
      console.error('[AuthContext] Google login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    authService.logout();
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    adminLogin,
    auditorLogin,
    googleLogin,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};