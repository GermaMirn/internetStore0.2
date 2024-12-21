// app/routes/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { username } = useAuth();

  if (!username) {
    return <Navigate to="/401" />;
  }

  return <>{element}</>;
};

export default PrivateRoute;
