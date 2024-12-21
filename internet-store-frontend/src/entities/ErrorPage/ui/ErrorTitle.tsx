import React from 'react';
import styles from './ErrorStyles.module.css';
import { ErrorTitleProps } from '../../../interfaces';


export const ErrorTitle: React.FC<ErrorTitleProps> = ({ title, status }) => {
  return (
    <div className={styles.titleError}>
      <h1>{title}</h1>
			<p className={styles.numberOfError}>{status}</p>
    </div>
  );
};
