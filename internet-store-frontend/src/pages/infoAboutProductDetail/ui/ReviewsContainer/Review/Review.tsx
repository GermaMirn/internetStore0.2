import React, { useState } from 'react';
import styles from './Review.module.css';
import CommentItem from '../Comment/Comment';
import HeartCommentAndReview from '../Heart';
import ReviewData from '../ReviewCommentData';
import { ReviewItemProps } from '../../../../../interfaces';


const ReviewItem: React.FC<ReviewItemProps> = ({
  id,
  user,
  text,
  created_at,
  hearts,
  imagesUrl,
  mainImage,
  isLiked,
  comments,
  updateReviewLikes,
  setIsLiked,
}) => {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleLikeToggle = () => {
    const newLikes = isLiked ? hearts - 1 : hearts + 1;
    updateReviewLikes(id, newLikes);
    setIsLiked(id, !isLiked);
  };

  return (
    <div className={styles.mainDivReview}>
      <div className={styles.review}>
        <ReviewData
          isReview={true}
          user={user}
          created_at={created_at}
          text={text}
					mainImage={mainImage}
          imagesUrl={imagesUrl}
          comments={comments}
          showComments={showComments}
          toggleComments={toggleComments}
        />

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
