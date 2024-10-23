import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './providers/notifications/NotificationProvider';
import LoginPage from '../pages/auth/login/LoginPage';
import RegistrationPage from '../pages/auth/registration/RegistrationPage';
import LoginChoicePage from '../pages/auth/login-choice/LoginChoicePage';
import WelcomePage from '../pages/welcome/WelcomePage';
import SearchProductsPage from '../pages/search-products/ui/SearchProductsPage';
import { Header } from '../shared/ui/Header/Header';


const App: React.FC = () => {
  return (
		<NotificationProvider>
			<Router>
				<Header/>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegistrationPage />} />
					<Route path="/enter" element={<LoginChoicePage />} />
					<Route path="/" element={<WelcomePage />} />
					<Route path="/catalog" element={<SearchProductsPage />} />
				</Routes>
			</Router>
		</NotificationProvider>
  );
};


export default App;
