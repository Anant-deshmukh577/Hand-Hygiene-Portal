import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('[AuthContext] Starting authentication check...');
    console.log('[AuthContext] API_BASE_URL:', process.env.EXPO_PUBLIC_API_URL);
    
    // AGGRESSIVE TIMEOUT - Force loading to false after 5 seconds
    const forceTimeout = setTimeout(() => {
      console.log('[AuthContext] FORCE TIMEOUT (5s) - Setting loading to false');
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
    }, 5000); // 5 seconds absolute max

    // Try to check auth
    checkAuth()
      .then(() => {
        console.log('[AuthContext] checkAuth completed successfully');
        clearTimeout(forceTimeout);
      })
      .catch((error) => {
        console.error('[AuthContext] checkAuth failed:', error);
        setLoading(false);
        setIsAuthenticated(false);
        setUser(null);
        clearTimeout(forceTimeout);
      });

    return () => {
      clearTimeout(forceTimeout);
    };
  }, []);

  const checkAuth = async () => {
    console.log('[AuthContext] checkAuth started');
    
    try {
      // Quick check for token with timeout
      console.log('[AuthContext] Checking for stored token...');
      const tokenPromise = SecureStore.getItemAsync('token');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Token check timeout')), 1000)
      );
      
      const token = await Promise.race([tokenPromise, timeoutPromise]).catch(() => null);
      console.log('[AuthContext] Token exists:', !!token);
      
      if (!token) {
        console.log('[AuthContext] No token - going to login');
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // If token exists, try to get user with timeout
      console.log('[AuthContext] Token found, fetching user...');
      
      try {
        const apiPromise = authService.getCurrentUser();
        const apiTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API timeout')), 5000)
        );
        
        const response = await Promise.race([apiPromise, apiTimeout]);
        const userData = response.user || response;
        console.log('[AuthContext] User loaded successfully:', userData?.email);
        
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (apiError) {
        console.error('[AuthContext] API error:', apiError.message);
        console.log('[AuthContext] Clearing invalid token and showing login');
        
        // Clear bad token
        try {
          await SecureStore.deleteItemAsync('token');
        } catch (e) {
          console.error('[AuthContext] Error clearing token:', e);
        }
        
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('[AuthContext] checkAuth error:', error);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // Backend authentication
      const data = await authService.login(credentials);
      console.log('[AuthContext] Login response:', data);
      
      // Store token
      await SecureStore.setItemAsync('token', data.token);
      
      // Update state
      const userData = data.user || data.data?.user || data;
      console.log('[AuthContext] Setting user:', userData);
      setUser(userData);
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
      console.log('[AuthContext] Admin login response:', data);
      
      // Store token
      await SecureStore.setItemAsync('token', data.token);
      
      // Update state
      const userData = data.user || data.data?.user || data;
      console.log('[AuthContext] Setting admin user:', userData);
      setUser(userData);
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
      console.log('[AuthContext] Auditor login response:', data);
      
      // Store token
      await SecureStore.setItemAsync('token', data.token);
      
      // Update state
      const userData = data.user || data.data?.user || data;
      console.log('[AuthContext] Setting auditor user:', userData);
      setUser(userData);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      console.error('[AuthContext] Auditor login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Backend registration
      const data = await authService.register(userData);
      console.log('[AuthContext] Register response:', data);
      
      // Store token
      await SecureStore.setItemAsync('token', data.token);
      
      // Update state
      const user = data.user || data.data?.user || data;
      console.log('[AuthContext] Setting registered user:', user);
      setUser(user);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      console.error('[AuthContext] Register error:', error);
      throw error;
    }
  };

  const googleLogin = async (idToken) => {
    try {
      const data = await authService.googleLogin(idToken);
      
      // Store token
      await SecureStore.setItemAsync('token', data.token);
      
      // Update state
      setUser(data.user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return data;
    } catch (error) {
      console.error('[AuthContext] Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
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
