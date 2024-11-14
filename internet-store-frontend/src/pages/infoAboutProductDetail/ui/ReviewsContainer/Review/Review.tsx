import React, { useState } from 'react';
import styles from './Review.module.css';
import CommentItem from '../Comment/Comment';
import HeartCommentAndReview from '../Heart';
import ReviewCommentData from '../ReviewCommentData';
import { ReviewItemProps } from '../../../../../interfaces';
import { Comment } from '../../../../../interfaces';


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
	const [updatedComments, setUpdatedComments] = useState(comments);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleLikeToggle = () => {
    const newLikes = isLiked ? hearts - 1 : hearts + 1;
    updateReviewLikes(id, newLikes);
    setIsLiked(id, !isLiked);
  };

	const handleNewComment = (newComment: Comment) => {
    setUpdatedComments((prevComments) => [...prevComments, newComment]);
  };

  return (
    <div className={styles.mainDivReview}>
      <div className={styles.review}>
        <ReviewCommentData
          isReview={true}
          user={user}
          created_at={created_at}
          text={text}
					reviewId={id}
					mainImage={mainImage}
          imagesUrl={imagesUrl}
          comments={updatedComments}
          showComments={showComments}
          toggleComments={toggleComments}
					onNewComment={handleNewComment}
        />

        <div className={styles.heartReview} onClick={handleLikeToggle}>
          <HeartCommentAndReview isReviewLiked={isLiked} reviewId={id} heartsCount={hearts} />
        </div>
      </div>

      {showComments && updatedComments.length > 0 && (
        <div className={styles.divForComments}>
          {updatedComments.map((comment) => (
            <CommentItem key={comment.id} {...comment} reviewId={id} onNewComment={handleNewComment} />
          ))}
        </div>
      )}
      <hr />
    </div>
  );
};


export default ReviewItem;
