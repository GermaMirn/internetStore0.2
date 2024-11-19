import React from 'react';
import styles from '../CategoriesMenu.module.css';
import { CategoriesListProps } from '../../../../../interfaces';


const CategoriesList: React.FC<CategoriesListProps> = ({ categories, selectedCategories, handleCategoryClick }) => {
  return (
    <div className={styles.divForCategories}>
      {categories.map((category) => (
        <p
          key={category.id}
          className={selectedCategories.includes(category.name) ? styles.active : ''}
          onClick={() => handleCategoryClick(category)}
        >
          {category.name}
        </p>
      ))}
    </div>
  );
};


export default CategoriesList;
