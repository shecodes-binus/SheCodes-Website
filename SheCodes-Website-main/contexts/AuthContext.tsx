'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/apiService';
import { Member } from '@/types/members'; // Use your existing Member type

// 1. Define the shape of the context's value
interface AuthContextType {
  user: Member | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

// 2. Create the context, telling TypeScript it can be the full type OR null
const AuthContext = createContext<AuthContextType | null>(null);

// 3. Create the Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Member | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        apiService.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          const response = await apiService.get<Member>('/users/me');
          setUser(response.data);
          setIsAdmin(response.data.role === 'admin');
        } catch (error) {
          console.error("Session expired or invalid:", error);
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (accessToken: string) => {
    setLoading(true);
    localStorage.setItem('authToken', accessToken);
    apiService.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setToken(accessToken);

    try {
      const response = await apiService.get<Member>('/users/me');
      const userData = response.data;
      setUser(userData);

      if (userData.role === 'admin') {
        setIsAdmin(true);
        router.push('/admin/events');
      } else {
        setIsAdmin(false);
        router.push('/app/dashboard');
      }
    } catch (error) {
      console.error("Failed to fetch user after login:", error);
      logout(); // Failsafe
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    delete apiService.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    router.push('/auth/login');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. Create the custom hook with the crucial type guard
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // This is the fix!
  // If context is null, it means we are trying to use it outside of its provider.
  // We throw an error to catch this problem early.
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // If we get past the check, TypeScript knows `context` is not null.
  return context;
};