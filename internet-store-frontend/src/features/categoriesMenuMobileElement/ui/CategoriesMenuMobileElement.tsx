import React from 'react';
import styles from './CategoriesMenuMobileElement.module.css';
import { CategoriesMenuMobileElementProps } from '../../../interfaces';


const CategoriesMenuMobileElement: React.FC<CategoriesMenuMobileElementProps> = ({
  nameCategorie,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`${styles.categoryElement} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
    >
      {nameCategorie}
    </div>
  );
};


export default CategoriesMenuMobileElement;
