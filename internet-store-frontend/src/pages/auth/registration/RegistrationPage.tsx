import React from 'react';
import RegistrationForm from '../../../features/auth/ui/RegistrationForm';
import styles from '../Auth.module.css';
import classNames from 'classnames';

const RegistrationPage: React.FC = () => {
  return (
    <div className={classNames(styles.divForAuthForms, styles.divForRegisterForm)}>
      <h1 className={styles.textOfForms}>Регистрация</h1>
      <RegistrationForm />
    </div>
  );
};

export default RegistrationPage;
