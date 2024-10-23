import React, { useState, useEffect } from 'react';
import { fetchSearchProducts } from '../api/fetchSearchProducts';
import ProductCard from '../../../entities/product/ui/ProductCard';
import Paginator from '../../../features/pagination/ui/Paginator';
import styles from './SearchProductsPage.module.css'

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  categories: string[];
  imagesURL: string[];
  mainImageUrl: string;
  hearts: number;
  isHearted: boolean;
}

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
    <div>
      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      <div className={styles.divForProductCard}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
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
