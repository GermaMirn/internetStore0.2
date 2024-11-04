import React, { useState } from 'react';
import styles from './Review.module.css';
import CommentItem, { Comment } from '../Comment/Comment';
import { formatDate } from '../utils/dateUtils';
import HeartCommentAndReview from '../Heart';

export interface Review {
  id: number;
  user: string;
  text: string;
  created_at: string;
  hearts: number;
  isLiked: boolean;
  imagesUrl: string[];
  mainImage: string | null;
  comments: Comment[];
}

interface ReviewItemProps extends Review {
  updateReviewLikes: (id: number, newLikes: number) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  id,
  user,
  text,
  created_at,
  hearts,
  isLiked,
  comments,
  updateReviewLikes,
}) => {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleLikeToggle = () => {
    const newLikes = isLiked ? hearts - 1 : hearts + 1;
    updateReviewLikes(id, newLikes);
  };

  return (
    <div className={styles.mainDivReview}>
      <div className={styles.review}>
        <div className={styles.logoUser}>
          <img className={styles.logo} src="/user/userLogo.svg" alt="user photo" />
        </div>

        <div className={styles.dataReview}>
          <h3 className={styles.userNameReview}>{user}</h3>
          <h5 className={styles.dateReview}>{formatDate(created_at)}</h5>
          <p className={styles.textReview}>{text}</p>

          {comments.length > 0 ? (
            <div className={styles.divComment} onClick={toggleComments}>
              <p className={styles.divCommentText}>{comments.length} ответов</p>
              <img
                className={`${styles.openCommetns} ${showComments ? styles.rotate : ''}`}
                src="/product/changeDown.svg"
                alt="open comments"
              />
            </div>
          ) : (
            <div>
              <p className={styles.divCommentText}>Комментировать</p>
            </div>
          )}
        </div>

        <div className={styles.heartReview} onClick={handleLikeToggle}>
          <HeartCommentAndReview isReviewLiked={isLiked} reviewId={id} heartsCount={hearts} />
        </div>
      </div>

      {showComments && comments.length > 0 && (
        <div className={styles.divForComments}>
          {comments.map((comment) => (
            <CommentItem key={comment.id} {...comment} />
          ))}
        </div>
      )}

      <hr />
    </div>
  );
};

export default ReviewItem;
