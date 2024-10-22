import React from 'react';
import { useLocation } from 'react-router-dom';
import Form from '../../../shared/ui/auth/Form';
import styles from '../Auth.module.css';


const LoginPage: React.FC = ( ) => {
	const location = useLocation();
	const username = location.state?.username || '';

  const handleSubmit = () => {
    console.log('Login form submitted');
  };

  return (
    <div className={styles.divForAuthForms}>
      <h1 className={styles.textOfForms}>Вход</h1>
      <Form onSubmit={handleSubmit} submitText="Войти" username={username} />
    </div>
  );
};


export default LoginPage;
