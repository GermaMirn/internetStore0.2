import React from 'react';
import styles from './Paginator.module.css';
import { PaginatorProps } from '../../../interfaces';


const Paginator: React.FC<PaginatorProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.paginator}>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`${styles.pageButton} ${pageNumber === currentPage ? styles.active : ''}`}
          onClick={() => onPageChange(pageNumber)}
          disabled={pageNumber === currentPage}
        >
          <h1 className={styles.textOfPaginator}>{pageNumber}</h1>
        </button>
      ))}
    </div>
  );
};


export default Paginator;
