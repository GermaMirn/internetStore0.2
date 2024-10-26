import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../../../features/auth/ui/LoginForm';
import styles from '../Auth.module.css';


const LoginPage: React.FC = () => {
  const location = useLocation();
  const username = location.state?.username || '';

  return (
    <div className={styles.divForAuthForms}>
      <h1 className={styles.textOfForms}>Вход</h1>
      <LoginForm username={username} />
    </div>
  );
};

export default LoginPage;
