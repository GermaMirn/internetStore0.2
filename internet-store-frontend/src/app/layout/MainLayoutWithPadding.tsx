import React from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from './MainLayout/MainLayout';
import IndexRoutes from '../routes/indexRoutes';

const MainLayoutWithPadding: React.FC = () => {
  const location = useLocation();
  const isChatPage = location.pathname.includes('/chat') || location.pathname.includes('/chats');

  return (
    <MainLayout noPadding={isChatPage}>
      <IndexRoutes />
    </MainLayout>
  );
};

export default MainLayoutWithPadding;
