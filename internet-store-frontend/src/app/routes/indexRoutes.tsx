import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../../pages/auth/login/LoginPage';
import RegistrationPage from '../../pages/auth/registration/RegistrationPage';
import LoginChoicePage from '../../pages/auth/login-choice/LoginChoicePage';
import WelcomePage from '../../pages/welcome/WelcomePage';
import SearchProductsPage from '../../pages/searchProducts/ui/SearchProductsPage';
import ShoppingCart from '../../pages/shoppingCart/ui/ShoppingCart';
import ProductDetail from '../../pages/infoAboutProductDetail/ui/ProductDetail';
import LikedProductsPage from '../../pages/favorits/ui/FavoritsPage';
import ProfilePage from '../../pages/profile/ui/ProfilePage';
import { NotFoundPage } from '../../pages/errors/NotFoundPage';
import { ServerError } from '../../pages/errors/ServerError';
import { Unauthorized } from '../../pages/errors/Unauthorized';
import OrdersPage from '../../pages/orders/ui/OrdersPage';
import ChatPage from '../../pages/chat/ui/ChatPage';


const IndexRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/enter" element={<LoginChoicePage />} />
      <Route path="/" element={<WelcomePage />} />
      <Route path="/catalog" element={<SearchProductsPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />

      {/* Защищенные маршруты с PrivateRoute */}
      <Route
        path="/profile"
        element={<PrivateRoute element={<ProfilePage />} />}
      />
      <Route
        path="/favorits"
        element={<PrivateRoute element={<LikedProductsPage />} />}
      />
      <Route
        path="/shoppingCart"
        element={<PrivateRoute element={<ShoppingCart />} />}
      />
      <Route
        path="/orders"
        element={<PrivateRoute element={<OrdersPage />} />}
      />
      <Route
        path="/chats"
        element={<PrivateRoute element={<ChatPage />} />}
      />

      {/* Страницы ошибок */}
      <Route path="/500" element={<ServerError />} />
      <Route path="/401" element={<Unauthorized />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};


export default IndexRoutes;
