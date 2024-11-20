import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../../pages/auth/login/LoginPage';
import RegistrationPage from '../../pages/auth/registration/RegistrationPage';
import LoginChoicePage from '../../pages/auth/login-choice/LoginChoicePage';
import WelcomePage from '../../pages/welcome/WelcomePage';
import SearchProductsPage from '../../pages/searchProducts/ui/SearchProductsPage';
import ShoppingCart from '../../pages/shoppingCart/ui/ShoppingCart';
import ProductDetail from '../../pages/infoAboutProductDetail/ui/ProductDetail';
import LikedProductsPage from '../../pages/favorits/ui/FavoritsPage';
import ProfilePage from '../../pages/profile/ui/ProfilePage';
import NotFoundPage from '../../pages/errors/NotFoundPage';
import OrdersPage from '../../pages/orders/ui/OrdersPage';
import ChatMessages from '../../pages/chat/ui/ChatMessages';


const IndexRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/enter" element={<LoginChoicePage />} />
      <Route path="/" element={<WelcomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/catalog" element={<SearchProductsPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/favorits" element={<LikedProductsPage />} />
      <Route path="/shoppingCart" element={<ShoppingCart />} />
			<Route path="/orders" element={<OrdersPage />} />
			<Route path="/chat/:chatId" element={<ChatMessages />} />
			<Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};


export default IndexRoutes;
