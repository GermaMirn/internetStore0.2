import React from 'react';
import styles from './ReviewsContainer.module.css';
import classNames from 'classnames';
import ComponentSort from '../../../../../shared/ui/ComponentSort/ComponentSort';
import ReviewItem from '../Review/Review';
import { Review } from '../Review/Review'


interface ReviewsProps {
  reviews: Review[];
  hearts: number;
}


const ReviewsContainer: React.FC<ReviewsProps> = ({ reviews, hearts }) => {
  return (
    <div className={styles.divReviews}>
      <div className={styles.headerReviews}>
        <h2 className={styles.textHeaderReviews}>Отзовы</h2>

        <p className={classNames(styles.sortTextHeaderReviews, styles.underline)}>Сортировать по:</p>

        <div className={styles.sortDiv}>
          <h5 className={classNames(styles.sortText, styles.underline)}>Дате</h5>
          <ComponentSort />

          <h5 className={classNames(styles.sortText, styles.underline)}>Количеству лайков</h5>
          <ComponentSort />
        </div>

        <div className={styles.divForHeart}>
          <h2 className={styles.countHearts}>{hearts}</h2>
          <img src="/product/fullHeart.svg" alt="" />
        </div>
      </div>

      <hr />

      <div>
				{reviews.length > 0 ? (
					reviews.map((review) => (
						<ReviewItem key={review.id} {...review} />
					))
				) : (
					<div>Нет отзывов</div>
				)}
			</div>
    </div>
  );
};


export default ReviewsContainer;
