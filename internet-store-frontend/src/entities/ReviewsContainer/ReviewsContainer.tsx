import React, { useState, useEffect } from 'react';
import { ReviewsProps } from '../../interfaces';
import { Review } from '../../interfaces';
import { sortReviews } from '../../shared/utils/sort';
import styles from './ReviewsContainer.module.css';
import classNames from 'classnames';
import ComponentSort from '../../shared/ui/ComponentSort/ComponentSort';
import ReviewItem from '../Review/Review';
import FormForSendNewReview from '../Review/FormForSendNewReview';
import { useIsMobile } from '../../app/routes/hooks/useIsMobile';


const ReviewsContainer: React.FC<ReviewsProps> = ({ productImg, productName, reviews, hearts, isReviewFormOpen, openFormAddReview, handleSubmitReview }) => {
	const token = localStorage.getItem('token');
  const isMobile = useIsMobile();
  const [sortedReviews, setSortedReviews] = useState<Review[]>(reviews);
  const [currentSort, setCurrentSort] = useState<'date' | 'likes'>('date');
  const [likesState, setLikesState] = useState<{ [key: number]: boolean }>({});
  const [isAscendingDate, setIsAscendingDate] = useState(true);
  const [isAscendingLikes, setIsAscendingLikes] = useState(true);

	useEffect(() => {
		setSortedReviews(sortReviews(reviews, currentSort, currentSort === 'likes' ? isAscendingLikes : isAscendingDate));
	}, [reviews, currentSort, isAscendingDate, isAscendingLikes]);


  const handleSortChange = (newSortedReviews: Review[]) => {
    setSortedReviews(newSortedReviews);
  };

  const updateReviewLikes = (id: number, newLikes: number) => {
    setSortedReviews(prevReviews => {
      const updatedReviews = prevReviews.map(review =>
        review.id === id ? { ...review, hearts: newLikes } : review
      );

      return sortReviews(updatedReviews, currentSort, currentSort === 'likes' ? isAscendingLikes : isAscendingDate);
    });
  };

  const toggleLike = (id: number, isLiked: boolean) => {
    setLikesState(prev => ({ ...prev, [id]: isLiked }));
  };

  return (
    <div className={isMobile ? styles.divReviewsMobile : styles.divReviews}>
      <div className={styles.headerReviews}>
        <h2 className={styles.textHeaderReviews}>Отзывы</h2>

        {!isMobile && (
          <>
            <p className={classNames(styles.sortTextHeaderReviews, styles.underline)}>
              Сортировать по:
            </p>

            <div className={styles.divForSort}>
              <ComponentSort
                reviews={sortedReviews}
                onSortChange={handleSortChange}
                currentSort={currentSort}
                isAscendingDate={isAscendingDate}
                isAscendingLikes={isAscendingLikes}
                setCurrentSort={setCurrentSort}
                setIsAscendingDate={setIsAscendingDate}
                setIsAscendingLikes={setIsAscendingLikes}
              />
            </div>
          </>
        )}

        <div className={styles.divForHeart}>
					{ token && (
						<button className={isMobile ?  styles.openCloseFormForSendNewReviewMobile : styles.openCloseFormForSendNewReview} onClick={openFormAddReview}>
							Оставить отзыв
						</button>
					)}
          <h2 className={styles.countHearts}>{hearts}</h2>
          <img src="/product/fullHeart.svg" alt="" />
        </div>
      </div>

      <hr />

      <div>
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <ReviewItem
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


export default ReviewsContainer;
