import React from 'react';
import styles from './ErrorStyles.module.css';
import { ErrorMessageProps } from '../../../interfaces';


export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, navigateText, navigate }) => {
  return (
    <p className={styles.errorText}>
      {message}
			<span
				className={styles.navigateTextStyles}
				onClick={navigate}
			>
				{navigateText}
			</span>
    </p>
  );
};
