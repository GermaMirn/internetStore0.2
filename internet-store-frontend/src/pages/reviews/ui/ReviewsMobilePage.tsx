import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getProductReviews } from '../api/getReviewsByProductId';
import styles from './ReviewsMobilePage.module.css';

const ReviewsMobilePage = () => {
  const location = useLocation();
  const [reviews, setReviews] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const productIdMatch = location.pathname.match(/\/product\/(\d+)\/reviews/);
    const productId = productIdMatch ? productIdMatch[1] : null;

    if (!productId) {
      setError('Product ID is missing');
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        const data = await getProductReviews(productId);
        setReviews(data);
      } catch {
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [location.pathname]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.ReviewsMobilePage}>
      <pre>{JSON.stringify(reviews, null, 2)}</pre>
    </div>
  );
};

export default ReviewsMobilePage;
