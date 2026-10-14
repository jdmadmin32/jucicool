import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin, loginCustomerOrAdmin, registerCustomer } from '../services/api';
import { User, RegisterData } from '../types';

interface AuthContextType {
  // Admin auth
  user: User | null; // Admin user (for backward compatibility)
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;

  // Customer auth (Dealer / Retailer / General)
  customerUser: User | null;
  customerToken: string | null;
  isCustomerAuthenticated: boolean;
  isDealerRetailer: boolean;
  customerLogin: (identifier: string, pass: string) => Promise<any>;
  customerRegister: (data: RegisterData) => Promise<any>;
  customerLogout: () => void;

  // Customer Login Modal state
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  loginModalSection: 'dealer' | 'general';
  setLoginModalSection: (section: 'dealer' | 'general') => void;
  openLoginModal: (section?: 'dealer' | 'general') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Admin state
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('jucicool_admin_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('jucicool_admin_token') || null;
  });

  // Customer state
  const [customerUser, setCustomerUser] = useState<User | null>(() => {
    try {
      const savedCustomer = localStorage.getItem('jucicool_customer_user');
      return savedCustomer ? JSON.parse(savedCustomer) : null;
    } catch {
      return null;
    }
  });

  const [customerToken, setCustomerToken] = useState<string | null>(() => {
    return localStorage.getItem('jucicool_customer_token') || null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Modal UI state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalSection, setLoginModalSection] = useState<'dealer' | 'general'>('dealer');

  const openLoginModal = (section: 'dealer' | 'general' = 'dealer') => {
    setLoginModalSection(section);
    setIsLoginModalOpen(true);
  };

  // Helper check for dealer/retailer status
  const isDealerRetailer = Boolean(
    customerUser &&
      (customerUser.customerType === 'Retailer' ||
        customerUser.customerType === 'Dealer' ||
        customerUser.customerType === 'dealer_retailer')
  );

  // Admin login
  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await loginAdmin(email, pass);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('jucicool_admin_token', data.token);
      localStorage.setItem('jucicool_admin_user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jucicool_admin_token');
    localStorage.removeItem('jucicool_admin_user');
  };

  // Customer / User login (supports dealer, customer, and admin accounts)
  const customerLogin = async (identifier: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await loginCustomerOrAdmin(identifier, pass);
      setCustomerUser(data.user);
      setCustomerToken(data.token);
      localStorage.setItem('jucicool_customer_token', data.token);
      localStorage.setItem('jucicool_customer_user', JSON.stringify(data.user));

      if (data.user.role === 'admin' || data.user.role === 'sales_rep') {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('jucicool_admin_token', data.token);
        localStorage.setItem('jucicool_admin_user', JSON.stringify(data.user));
      }

      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  // Customer registration
  const customerRegister = async (regData: RegisterData) => {
    setIsLoading(true);
    try {
      const data = await registerCustomer(regData);
      setCustomerUser(data.user);
      setCustomerToken(data.token);
      localStorage.setItem('jucicool_customer_token', data.token);
      localStorage.setItem('jucicool_customer_user', JSON.stringify(data.user));
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const customerLogout = () => {
    setCustomerUser(null);
    setCustomerToken(null);
    localStorage.removeItem('jucicool_customer_token');
    localStorage.removeItem('jucicool_customer_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        isLoading,

        customerUser,
        customerToken,
        isCustomerAuthenticated: !!customerToken,
        isDealerRetailer,
        customerLogin,
        customerRegister,
        customerLogout,

        isLoginModalOpen,
        setIsLoginModalOpen,
        loginModalSection,
        setLoginModalSection,
        openLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
