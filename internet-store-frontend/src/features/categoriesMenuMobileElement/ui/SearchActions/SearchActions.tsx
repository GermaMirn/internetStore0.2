import React from 'react';
import styles from './SearchActions.module.css';


interface SearchActionsProps {
  onReset: () => void;
  onSearch: () => void;
}


const SearchActions: React.FC<SearchActionsProps> = ({ onReset, onSearch }) => {
  return (
    <div className={styles.actions}>
      <div className={styles.resetButton} onClick={onReset}>
        <img className={`${styles.svg} ${styles.resetSvg}`} src="/product/resetCategoriesMobile.svg" alt="reset button" />
      </div>
      <div className={styles.searchButton} onClick={onSearch}>
        <img className={styles.svg} src="/product/searchCategoriesMobile.svg" alt="search button" />
      </div>
    </div>
  );
};


export default SearchActions;
