import React from 'react';
import styles from './ErrorStyles.module.css';
import { ErrorTitleProps } from '../../../interfaces';


export const ErrorTitle: React.FC<ErrorTitleProps> = ({ title, status }) => {
  return (
    <div className={styles.titleError}>
      <h1>
        <span className={styles.titleText}>{title}</span>
        <span className={styles.numberOfError}>{status}</span>
      </h1>
    </div>
  );
};
