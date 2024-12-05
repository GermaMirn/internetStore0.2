import React from 'react';
import styles from './SearchInputHeader.module.css';
import { SearchInputProps } from '../../../../interfaces';


const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onKeyDown }) => {
  return (
    <input
      type="text"
      className={styles.searchInput}
      value={value}
      onChange={onChange}
			onKeyDown={onKeyDown}
      placeholder="Найти продукт..."
    />
  );
};


export default SearchInput;
