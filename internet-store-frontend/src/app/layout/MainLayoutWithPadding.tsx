import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from './MainLayout/MainLayout';
import IndexRoutes from '../routes/indexRoutes';


const MainLayoutWithPadding: React.FC = () => {
  const location = useLocation();
  const [shouldRemovePadding, setShouldRemovePadding] = useState(false);
  const productPaths = ['/chat', '/chats'];

  const isProductPage = location.pathname.includes('/product');
  const isPageWithoutPadiing = productPaths.some((path) => location.pathname.includes(path));

  useEffect(() => {
    if (isProductPage) {
      const handleResize = () => {
        if (window.innerWidth <= 910) {
          setShouldRemovePadding(true);
        } else {
          setShouldRemovePadding(false);
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    } else {
      setShouldRemovePadding(isPageWithoutPadiing);
    }
  }, [location.pathname, isPageWithoutPadiing, isProductPage]);

  return (
    <MainLayout noPadding={shouldRemovePadding}>
      <IndexRoutes />
    </MainLayout>
  );
};


export default MainLayoutWithPadding;
