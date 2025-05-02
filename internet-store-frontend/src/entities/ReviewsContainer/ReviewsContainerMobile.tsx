import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReviewsProps } from '../../interfaces';
import styles from './ReviewsContainerMobile.module.css';
import ReviewMobile from '../../features/review/ReviewMobile';
import FormForSendNewReview from '../formForSendNewReviewComment/FormForSendNewReview';

const ReviewsContainerMobile: React.FC<ReviewsProps> = ({
  productId,
  productImg,
  productName,
  reviews,
  hearts,
  isReviewFormOpen,
  openFormAddReview,
  handleSubmitReview
}) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [likesState, setLikesState] = useState<{ [key: number]: boolean }>({});

  const updateReviewLikes = () => {};

  const toggleLike = (id: number, isLiked: boolean) => {
    setLikesState(prev => ({ ...prev, [id]: isLiked }));
  };

  const lastReview = reviews[reviews.length - 1];

  const handleViewAll = () => {
    navigate(`/product/${productId}/reviews`);
  };

  return (
    <div className={styles.divReviewsMobile}>
      <div className={styles.headerReviews}>
        <h3 className={styles.textHeaderReviews}>Отзывы</h3>

        <div className={styles.divForHeart}>
          {token && (
            <button
              className={styles.openCloseFormForSendNewReviewMobile}
              onClick={openFormAddReview}
            >
              Оставить отзыв
            </button>
          )}
          <h3 className={styles.countHearts}>{hearts}</h3>
          <img className={styles.hearts} src="/product/fullHeart.svg" alt="" />
        </div>
      </div>

      <hr />

      <div>
        {lastReview ? (
          <>
            <ReviewMobile
              key={lastReview.id}
              {...lastReview}
              updateReviewLikes={updateReviewLikes}
              isLiked={likesState[lastReview.id] ?? lastReview.isLiked}
              setIsLiked={toggleLike}
            />
            {reviews.length > 1 && (
              <div className={styles.viewAll} onClick={handleViewAll}>
                Посмотреть все отзывы
              </div>
            )}
          </>
        ) : (
          <div>Нет отзывов</div>
        )}
      </div>

      {isReviewFormOpen && (
        <div className={styles.reviewForm}>
          <FormForSendNewReview
            productImg={productImg}
            productName={productName}
            onClose={openFormAddReview}
            handleSubmitReview={handleSubmitReview}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewsContainerMobile;
