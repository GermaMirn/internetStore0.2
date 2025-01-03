import React, { createContext, useContext, useState } from 'react';
import styles from './NotificationProvider.module.css';


interface NotificationContextProps {
  showNotification: (message: string, type: 'success' | 'error') => void;
}


const NotificationContext = createContext<NotificationContextProps | null>(null);


export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};


export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<'success' | 'error' | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setMessage(message);
    setType(type);
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setMessage(null);
        setType(null);
      }, 500);
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {message && type && (
        <div className={`${styles.notification} ${styles[type]} ${isVisible ? styles.show : ''}`}>
          {message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
