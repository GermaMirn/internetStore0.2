import React from 'react';
import styles from './Paginator.module.css';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Генерация массива страниц
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.paginator}>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`${styles.pageButton} ${pageNumber === currentPage ? styles.active : ''}`}
          onClick={() => onPageChange(pageNumber)}
          disabled={pageNumber === currentPage} // Отключаем кнопку для текущей страницы
        >
          <h1 className={styles.textOfPaginator}>{pageNumber}</h1>
        </button>
      ))}
    </div>
  );
};

export default Paginator;
