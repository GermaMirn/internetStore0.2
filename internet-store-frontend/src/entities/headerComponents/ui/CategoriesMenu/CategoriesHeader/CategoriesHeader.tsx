import React from 'react';
import styles from '../CategoriesMenu.module.css';
import { CategoriesHeaderProps } from '../../../../../interfaces';


const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({ toggleCategoriesMenu, selectedCategories }) => {
  return (
    <div className={styles.categoriesHeader}>
      <img onClick={toggleCategoriesMenu} className={styles.closeButton} src="/header/close.svg" alt="Close" />
      <h2 className={styles.nameHeader}>Категории</h2>
      <h2 className={styles.countCategories}>Выбрано {selectedCategories.length} тегов</h2>
    </div>
  );
};


export default CategoriesHeader;
