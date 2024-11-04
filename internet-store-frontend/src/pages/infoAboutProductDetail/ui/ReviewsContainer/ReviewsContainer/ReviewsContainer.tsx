import React, { useState } from 'react';
import styles from './ReviewsContainer.module.css';
import classNames from 'classnames';
import ComponentSort from '../../../../../shared/ui/ComponentSort/ComponentSort';
import ReviewItem from '../Review/Review';
import { Review } from '../Review/Review';

interface ReviewsProps {
  reviews: Review[];
  hearts: number;
}

const ReviewsContainer: React.FC<ReviewsProps> = ({ reviews, hearts }) => {
  const [sortedReviews, setSortedReviews] = useState<Review[]>(reviews);

  const handleSortChange = (newSortedReviews: Review[]) => {
    setSortedReviews(newSortedReviews);
  };

  const updateReviewLikes = (id: number, newLikes: number) => {
    setSortedReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === id ? { ...review, hearts: newLikes } : review
      )
    );
  };

  return (
    <div className={classNames(styles.divReviews)}>
      <div className={styles.headerReviews}>
        <h2 className={styles.textHeaderReviews}>Отзовы</h2>
        <p className={classNames(styles.sortTextHeaderReviews, styles.underline)}>Сортировать по:</p>
        <ComponentSort
          reviews={sortedReviews}
          onSortChange={handleSortChange}
        />
        <div className={styles.divForHeart}>
          <h2 className={styles.countHearts}>{hearts}</h2>
          <img src="/product/fullHeart.svg" alt="" />
        </div>
      </div>

      <hr />

      <div>
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <ReviewItem key={review.id} {...review} updateReviewLikes={updateReviewLikes} />
          ))
        ) : (
          <div>Нет отзывов</div>
        )}
      </div>
    </div>
  );
};

export default ReviewsContainer;
