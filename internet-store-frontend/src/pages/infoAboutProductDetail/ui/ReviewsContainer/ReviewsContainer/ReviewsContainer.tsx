import React, { useState } from 'react';
import styles from './ReviewsContainer.module.css';
import classNames from 'classnames';
import ComponentSort from '../../../../../shared/ui/ComponentSort/ComponentSort';
import ReviewItem from '../Review/Review';
import { Review } from '../Review/Review';
import { sortReviews } from '../utils/sortReviews';


interface ReviewsProps {
  reviews: Review[];
  hearts: number;
}


const ReviewsContainer: React.FC<ReviewsProps> = ({ reviews, hearts }) => {
  const [sortedReviews, setSortedReviews] = useState<Review[]>(reviews);
	const [currentSort, setCurrentSort] = useState<'date' | 'likes'>('date');
	const [likesState, setLikesState] = useState<{ [key: number]: boolean }>({});
	const [isAscendingDate, setIsAscendingDate] = useState(true);
	const [isAscendingLikes, setIsAscendingLikes] = useState(true);

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
		setLikesState((prev) => ({ ...prev, [id]: isLiked }));
	};

  return (
    <div className={classNames(styles.divReviews)}>
      <div className={styles.headerReviews}>
        <h2 className={styles.textHeaderReviews}>Отзовы</h2>
        <p className={classNames(styles.sortTextHeaderReviews, styles.underline)}>Сортировать по:</p>

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

        <div className={styles.divForHeart}>
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
    </div>
  );
};


export default ReviewsContainer;
