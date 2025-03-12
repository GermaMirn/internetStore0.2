import React from 'react';
import styles from './EmptyPageText.module.css';


interface EmptyPageTextProps {
	text: string;
}


const EmptyPageText: React.FC<EmptyPageTextProps> = ({ text }) => {

  return (
    <div className={styles.emptyTextDiv}>
			<h2>{text}</h2>
    </div>
  );
};


export default EmptyPageText;
