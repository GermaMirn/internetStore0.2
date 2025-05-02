import React, { useState, useEffect } from 'react';
import { ReviewsProps } from '../../interfaces';
import { ReviewProps } from '../../interfaces';
import { sortReviews } from '../../shared/utils/sort';
import styles from './ReviewsContainer.module.css';
import classNames from 'classnames';
import ComponentSort from '../../shared/ui/ComponentSort/ComponentSort';
import Review from '../../features/review/Review';
import FormForSendNewReview from '../formForSendNewReviewComment/FormForSendNewReview';


const ReviewsContainer: React.FC<ReviewsProps> = ({ productImg, productName, reviews, hearts, isReviewFormOpen, openFormAddReview, handleSubmitReview }) => {
	const token = localStorage.getItem('token');
  const [sortedReviews, setSortedReviews] = useState<ReviewProps[]>(reviews);
  const [currentSort, setCurrentSort] = useState<'date' | 'likes'>('date');
  const [likesState, setLikesState] = useState<{ [key: number]: boolean }>({});
  const [isAscendingDate, setIsAscendingDate] = useState(true);
  const [isAscendingLikes, setIsAscendingLikes] = useState(true);

	useEffect(() => {
		setSortedReviews(sortReviews(reviews, currentSort, currentSort === 'likes' ? isAscendingLikes : isAscendingDate));
	}, [reviews, currentSort, isAscendingDate, isAscendingLikes]);


  const handleSortChange = (newSortedReviews: ReviewProps[]) => {
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
    <div className={styles.divReviews}>
      <div className={styles.headerReviews}>
        <h2 className={styles.textHeaderReviews}>Отзывы</h2>

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

        <div className={styles.divForHeart}>
					{ token && (
						<button className={styles.openCloseFormForSendNewReview} onClick={openFormAddReview}>
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
            <Review
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
