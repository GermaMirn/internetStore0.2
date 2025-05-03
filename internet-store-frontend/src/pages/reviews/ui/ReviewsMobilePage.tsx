import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProductReviews } from '../api/getReviewsByProductId';
import styles from './ReviewsMobilePage.module.css';
import ReviewMobile from '../../../features/review/ReviewMobile';
import { ReviewProps } from '../../../interfaces';


const ReviewsMobilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [productId, setProductId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ReviewProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [likesState, setLikesState] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const productIdMatch = location.pathname.match(/\/product\/(\d+)\/reviews/);
    const productId = productIdMatch ? productIdMatch[1] : null;
    setProductId(productId);

    if (!productId) {
      setError('Product ID is missing');
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        const data = await getProductReviews(productId);
        if (data?.reviews) {
          setReviews(data.reviews);
        } else {
          setError('No reviews found');
        }
      } catch {
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [location.pathname]);

  const handleBackClick = () => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };


  const toggleLike = (id: number, isLiked: boolean) => {
    setLikesState(prev => ({ ...prev, [id]: isLiked }));
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.reviewsMobilePage}>
      <div className={styles.reviewsPageHeader}>
        <img
          onClick={handleBackClick}
          className={styles.returnArrow}
          src={'/product/backArrow.svg'}
          alt="return arrow"
        />

        <h3>Отзовы</h3>

        <img
          className={styles.returnArrow}
          src={'/product/filters.svg'}
          alt="reviews filters"
        />
      </div>

      {reviews.length > 0 ? (
        <div className={styles.reviews}>
          {reviews.map(review => (
            <ReviewMobile
              key={review.id}
              {...review}
              updateReviewLikes={() => {}}
              isLiked={likesState[review.id] ?? review.isLiked}
              setIsLiked={toggleLike}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noReviews}>Нет отзывов</div>
      )}
    </div>
  );
};

export default ReviewsMobilePage;
