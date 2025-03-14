import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../../../features/auth/ui/LoginForm';
import styles from '../Auth.module.css';
import ReturnArrow from '../../../shared/ui/ReturnArrow/ReturnArrow';


const LoginPage: React.FC = () => {
  const location = useLocation();
  const username = location.state?.username || '';

  return (
    <div className={styles.divForAuthForms}>
      <div className={styles.returnArrowDiv}>
        <ReturnArrow arrowSrc='/user/returnArrow.svg' />
      </div>

      <h1 className={styles.textOfForms}>Вход</h1>
      <LoginForm username={username} />
    </div>
  );
};

export default LoginPage;
