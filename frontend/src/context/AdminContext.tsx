import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AdminContextType {
  admin: Admin | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('admin');

    if (token && storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      setIsAdminAuthenticated(true);
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const adminLogin = async (email: string, password: string) => {
    const response = await api.post('/admin/auth/login', { email, password });
    const { token, admin: adminData } = response.data;

    localStorage.setItem('adminToken', token);
    localStorage.setItem('admin', JSON.stringify(adminData));

    setAdmin(adminData);
    setIsAdminAuthenticated(true);

    // Set token in axios headers
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    delete api.defaults.headers.common['Authorization'];

    setAdmin(null);
    setIsAdminAuthenticated(false);
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
