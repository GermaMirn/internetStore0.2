import React, { useState, useEffect, useMemo } from 'react';
import { fetchSearchProducts } from '../api/getProducts';
import { useLocation } from 'react-router-dom';
import { Product } from '../../../interfaces';
import ProductContainer from '../../../entities/product/ui/ProductContainer';
import Paginator from '../../../features/pagination/ui/Paginator';
import styles from './SearchProductsPage.module.css';
import { useErrorRedirect } from '../../../hooks/errorHandler';


const SearchProductsPage: React.FC = () => {
	const location = useLocation();
	const searchField = useMemo(() => location.state?.searchQuery || '', [location.state?.searchQuery]);
	const categories = useMemo(() => location.state?.selectedCategories || [], [location.state?.selectedCategories]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
	const handleError = useErrorRedirect();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchSearchProducts(currentPage, searchField, categories);
        setProducts(data.products);
        setTotalPages(data.total_pages);
      } catch (error) {
        handleError(error);
      } finally {
      }
    };

    loadProducts();
  }, [searchField, categories, currentPage]);

  return (
    <div className={styles.divForProductCards}>
      {searchField && (
				<div>
					<p>По запросу <span className={styles.searchField}>{searchField}</span> найдено {products.length} результата</p>
				</div>
			)}

      <div className={styles.divForProductCard}>
        {products.map((product) => (
          <ProductContainer key={product.id} product={product} />
        ))}
      </div>

			{products.length > 0 && totalPages > 1 && (
				<Paginator
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={(page: number) => setCurrentPage(page)}
				/>
			)}
    </div>
  );
};


export default SearchProductsPage;
