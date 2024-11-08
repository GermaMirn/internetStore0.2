import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './providers/notifications/NotificationProvider';
import { AuthProvider } from './context/AuthContext';
import { fetchCsrfToken } from '../shared/api/csrf';
import { Header } from '../shared/ui/Header/Header';
import { Footer } from '../shared/ui/Fotter/Footer';
import LoginPage from '../pages/auth/login/LoginPage';
import RegistrationPage from '../pages/auth/registration/RegistrationPage';
import LoginChoicePage from '../pages/auth/login-choice/LoginChoicePage';
import WelcomePage from '../pages/welcome/WelcomePage';
import SearchProductsPage from '../pages/searchProducts/ui/SearchProductsPage';
import ShoppingCart from '../pages/shoppingCart/ui/ShoppingCart';
import ProductDetail from '../pages/infoAboutProductDetail/ui/ProductDetail';
import LikedProductsPage from '../pages/favorits/ui/FavoritsPage';
import ProfilePage from '../pages/profile/ui/ProfilePage';
import styles from './App.module.css'


const App: React.FC = () => {
	useEffect(() => {
		fetchCsrfToken();
	}, []);

  return (
		<AuthProvider>
			<NotificationProvider>
				<Router>
					<div className={styles.appContainer}>
						<Header/>
						<main className={styles.mainContent}>
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
							</Routes>
						</main>
						<Footer />
					</div>
				</Router>
			</NotificationProvider>
		</AuthProvider>
  );
};


export default App;
