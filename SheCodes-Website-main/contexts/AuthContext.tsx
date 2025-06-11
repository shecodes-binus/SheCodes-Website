// /SheCodes-Website-main/contexts/AuthContext.tsx (New File)
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/apiService';
import { Member as User } from '@/types/members'; // Using Member as the detailed User type

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.get('/users/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user', error);
      setUser(null);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (token: string) => {
    localStorage.setItem('accessToken', token);
    fetchUser().then(() => {
      // This will be called after user state is set
      // We will perform the role-based redirect here
    });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    router.push('/auth/login');
  };
  
  // This effect runs after the user state has been updated by login()
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin/events'); // Redirect admin
      } else {
        router.push('/app/dashboard'); // Redirect other roles
      }
    }
  }, [user, router]);


  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    logout,
    refetchUser: fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};