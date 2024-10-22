import React from 'react';
import Form from '../../../shared/ui/auth/Form';
import styles from '../Auth.module.css';
import classNames from 'classnames';


const RegistrationPage: React.FC = () => {
  const handleSubmit = () => {
    console.log('Registration form submitted');
  };

  return (
    <div className={classNames(styles.divForAuthForms, styles.divForRegisterForm)}>
      <h1 className={styles.textOfForms}>Регистрация</h1>
      <Form onSubmit={handleSubmit} submitText="Создать аккаунт" isRegistration={true} />
    </div>
  );
};


export default RegistrationPage;
