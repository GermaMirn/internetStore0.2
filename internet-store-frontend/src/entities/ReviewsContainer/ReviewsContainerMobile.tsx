import React, { useState } from 'react';
import { ReviewsProps } from '../../interfaces';
import styles from './ReviewsContainerMobile.module.css';
import ReviewMobile from '../../features/review/ReviewMobile';
import FormForSendNewReview from '../formForSendNewReviewComment/FormForSendNewReview';


const ReviewsContainerMobile: React.FC<ReviewsProps> = ({
  productImg,
  productName,
  reviews,
  hearts,
  isReviewFormOpen,
  openFormAddReview,
  handleSubmitReview
}) => {
  const token = localStorage.getItem('token');
  const [likesState, setLikesState] = useState<{ [key: number]: boolean }>({});

  const updateReviewLikes = () => {};

  const toggleLike = (id: number, isLiked: boolean) => {
    setLikesState(prev => ({ ...prev, [id]: isLiked }));
  };

  return (
    <div className={styles.divReviewsMobile}>
      <div className={styles.headerReviews}>
        <h2 className={styles.textHeaderReviews}>Отзывы</h2>

        <div className={styles.divForHeart}>
          {token && (
            <button
              className={styles.openCloseFormForSendNewReviewMobile}
              onClick={openFormAddReview}
            >
              Оставить отзыв
            </button>
          )}
          <h2 className={styles.countHearts}>{hearts}</h2>
          <img src="/product/fullHeart.svg" alt="" />
        </div>
      </div>

      <hr />

      <div>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewMobile
              key={review.id}
              {...review}
              updateReviewLikes={updateReviewLikes}
              isLiked={likesState[review.id] ?? review.isLiked}
              setIsLiked={toggleLike}
            />
          ))
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
