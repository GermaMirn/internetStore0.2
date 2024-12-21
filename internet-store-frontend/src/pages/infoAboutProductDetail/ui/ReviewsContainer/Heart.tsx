import React, { useState, useEffect } from 'react';
import styles from './Heart.module.css';
import classNames from 'classnames';
import { addHeartToComment, removeHeartFromComment } from '../../api/HeartCommentAndReview/commentHeart';
import { addHeartToReview, removeHeartFromReview } from '../../api/HeartCommentAndReview/reviewHeart';
import { HeartProps } from '../../../../interfaces';
import { useNotification } from '../../../../app/providers/notifications/NotificationProvider';


const HeartCommentAndReview: React.FC<HeartProps> = ({
  isCommentLiked = false,
  isReviewLiked = false,
  commentId,
  reviewId,
  heartsCount,
  onToggleLike,
}) => {
  const [isLiked, setIsLiked] = useState(isCommentLiked || isReviewLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [currentHeartsCount, setCurrentHeartsCount] = useState(heartsCount);
	const { showNotification } = useNotification();

  useEffect(() => {
    setIsLiked(isCommentLiked || isReviewLiked);
  }, [isCommentLiked, isReviewLiked]);

  const toggleLike = async () => {
    setIsLoading(true);
    try {
      const newLikedState = !isLiked;

      if (newLikedState) {
        if (commentId) {
          await addHeartToComment(commentId);
          setCurrentHeartsCount((prev) => prev + 1);
        } else if (reviewId) {
          await addHeartToReview(reviewId);
          setCurrentHeartsCount((prev) => prev + 1);
        }
      } else {
        if (commentId) {
          await removeHeartFromComment(commentId);
          setCurrentHeartsCount((prev) => prev - 1);
        } else if (reviewId) {
          await removeHeartFromReview(reviewId);
          setCurrentHeartsCount((prev) => prev - 1);
        }
      }

      if (onToggleLike) {
        await onToggleLike(newLikedState, currentHeartsCount);
      } else {
        setIsLiked(newLikedState);
      }
    } catch (error) {
      showNotification('Ошибка при изменении статуса лайка', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
		<div className={styles.divForCountAndHeartImg}>
			<p className={styles.countHeartReview}>{currentHeartsCount}</p>
			<div
				className={classNames(
					styles.heartContainer,
					{ [styles.liked]: isLiked },
					{ [styles.notLiked]: !isLiked }
				)}
				onClick={toggleLike}
			>
				{isLoading ? (
					<p>Загрузка...</p>
				) : isLiked ? (
					<img className={styles.heartIcon} src={'/product/fullHeart.svg'} alt="Liked" />
				) : (
					<img className={styles.heartIcon} src={'/product/emptyHeart.svg'} alt="Not liked" />
				)}
			</div>
		</div>
  );
};


export default HeartCommentAndReview;
