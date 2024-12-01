import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axiosInstance from '../../shared/api/axiosInstance';

interface AuthContextType {
  username: string | null;
  fullname: string | null;
  phoneNumber: string | null;
  login: (username: string) => void;
  logout: () => void;
  updateUserData: (username: string, fullname: string, phoneNumber: string) => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [fullname, setFullname] = useState<string | null>(localStorage.getItem('fullname'));
  const [phoneNumber, setPhoneNumber] = useState<string | null>(localStorage.getItem('phoneNumber'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    const savedFullname = localStorage.getItem('fullname');
    const savedPhoneNumber = localStorage.getItem('phoneNumber');

    if (token && savedUsername) {
      setUsername(savedUsername);
      setFullname(savedFullname);
      setPhoneNumber(savedPhoneNumber);
    }
  }, []);

  const login = (username: string) => {
    setUsername(username);
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setUsername(null);
    setFullname(null);
    setPhoneNumber(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('fullname');
    localStorage.removeItem('phoneNumber');
    axiosInstance.defaults.headers.common['Authorization'] = '';
    delete axiosInstance.defaults.headers.common['X-CSRFToken'];
  };

  const updateUserData = (username: string, fullname: string, phoneNumber: string) => {
    setUsername(username);
    setFullname(fullname);
    setPhoneNumber(phoneNumber);

    localStorage.setItem('username', username);
    localStorage.setItem('fullname', fullname);
    localStorage.setItem('phoneNumber', phoneNumber);
  };

  return (
    <AuthContext.Provider value={{ username, fullname, phoneNumber, login, logout, updateUserData }}>
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
