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

  const declineWord = (count: number, words: [string, string, string]) => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return words[0];     // 1 отзыв
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return words[1]; // 2–4 отзыва
    return words[2];
  }

  return (
    <div className={styles.divReviewsMobile}>
      <div className={styles.headerReviews}>
        {reviews.length > 0 ? (
          <h3 className={styles.textHeaderReviews}>
            {reviews.length} {declineWord(reviews.length, ['отзыв', 'отзыва', 'отзывов'])}
          </h3>
        ) : (
          <h3 className={styles.textHeaderReviews}>Отзовы</h3>
        )}

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
