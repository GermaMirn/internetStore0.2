import React, { useState, useEffect } from 'react';
import { fetchSearchProducts } from '../api/getProducts';
import ProductContainer from '../../../entities/product/ui/ProductContainer';
import Paginator from '../../../features/pagination/ui/Paginator';
import styles from './SearchProductsPage.module.css';
import { Product } from '../../../interfaces';


const SearchProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSearchProducts(currentPage);
        setProducts(data.products);
        setTotalPages(data.total_pages);
      } catch (error) {
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage]);

  return (
    <div className={styles.divForProductCards}>
      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      <div className={styles.divForProductCard}>
        {products.map((product) => (
          <ProductContainer key={product.id} product={product} />
        ))}
      </div>

      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => setCurrentPage(page)}
      />
    </div>
  );
};


export default SearchProductsPage;
