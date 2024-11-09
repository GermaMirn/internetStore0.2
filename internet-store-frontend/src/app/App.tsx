import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotificationProvider } from './providers/notifications/NotificationProvider';
import { AuthProvider } from './context/AuthContext';
import { fetchCsrfToken } from '../shared/api/csrf';
import MainLayout from './layout/MainLayout';
import IndexRoutes from './routes/indexRoutes';


const App: React.FC = () => {
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <MainLayout>
            <IndexRoutes />
          </MainLayout>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};


export default App;
