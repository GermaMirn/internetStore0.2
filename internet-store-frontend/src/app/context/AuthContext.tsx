import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axiosInstance from '../../shared/api/axiosInstance';


interface AuthContextType {
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');

    if (token && savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const login = (username: string) => {
    setUsername(username);
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
		axiosInstance.defaults.headers.common['Authorization'] = '';
  	delete axiosInstance.defaults.headers.common['X-CSRFToken'];
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
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
