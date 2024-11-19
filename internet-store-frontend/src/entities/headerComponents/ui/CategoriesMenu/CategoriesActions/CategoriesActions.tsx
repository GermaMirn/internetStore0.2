import React from 'react';
import styles from '../CategoriesMenu.module.css';
import { CategoriesButtonsProps } from '../../../../../interfaces';


const CategoriesActions: React.FC<CategoriesButtonsProps> = ({ handleSearch, handleResetCategories }) => {
  return (
    <div className={styles.buttonContainer}>
      <button onClick={handleSearch} className={styles.resetButton}>
        Поиск по категориям
      </button>
      <button onClick={handleResetCategories} className={styles.resetButton}>
        Сбросить все категории
      </button>
    </div>
  );
};


export default CategoriesActions;
