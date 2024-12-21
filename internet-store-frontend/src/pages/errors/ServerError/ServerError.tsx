import React from 'react';
import { ErrorTitle, ErrorMessage } from '../../../entities/ErrorPage';
import styles from './ServerError.module.css';

export const ServerError: React.FC = () => {
  return (
    <div className={styles.serverError}>
      <ErrorTitle title="Сервер временно не работает" status={"500"} />
      <ErrorMessage message="Произошла ошибка на сервере. Пожалуйста, попробуйте позже." />
    </div>
  );
};

export default ServerError;
