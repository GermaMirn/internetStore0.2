import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotificationProvider } from './providers/notifications/NotificationProvider';
import { AuthProvider } from './context/AuthContext';
import { fetchCsrfToken } from '../shared/api/csrf';
import MainLayoutWithPadding from './layout/MainLayoutWithPadding';


const App: React.FC = () => {
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
					<MainLayoutWithPadding />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};


export default App;
