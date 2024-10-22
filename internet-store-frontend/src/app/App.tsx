import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth/login/LoginPage';
import RegistrationPage from '../pages/auth/registration/RegistrationPage';
import LoginChoicePage from '../pages/auth/login-choice/LoginChoicePage';
import WelcomePage from '../pages/welcome/WelcomePage';
import { Header } from '../shared/ui/Header/Header';


const App: React.FC = () => {
  return (
    <Router>
			<Header/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/enter" element={<LoginChoicePage />} />
				<Route path="/" element={<WelcomePage />} />
      </Routes>
    </Router>
  );
};


export default App;
