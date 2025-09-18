import { navigate } from 'expo-router/build/global-state/routing';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken, getUserData, removeTokens, removeUserData, saveTokens, saveUserData } from '../utils/storage';

interface User {
  id?: string;
  email: string;
  name?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      const userData = await getUserData();

      if (accessToken && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User, accessToken: string, refreshToken?: string) => {
    try {
      await saveUserData(userData);
      await saveTokens(accessToken, refreshToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await removeUserData();
      await removeTokens();
      setUser(null);
      setIsAuthenticated(false);
      navigate('/onboarding');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkAuth();
    navigate('/(tabs)');
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}