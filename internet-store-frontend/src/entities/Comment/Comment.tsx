import React from 'react';
import styles from './Comment.module.css';
import HeartCommentAndReview from '../../pages/infoAboutProductDetail/ui/ReviewsContainer/Heart';
import ReviewCommentData from '../../pages/infoAboutProductDetail/ui/ReviewsContainer/ReviewCommentData';
import { Comment } from '../../interfaces';


const CommentItem: React.FC<Comment> = ({
	id,
	reviewId,
	user,
	text,
	created_at,
	hearts,
	isLiked,
	mainImage,
	imagesUrl,
	onNewComment
}) => {
  return (
    <div className={styles.mainDivComment}>
      <div className={styles.comment}>
				<ReviewCommentData
					isReview={false}
					reviewId={reviewId}
          user={user}
          created_at={created_at}
          text={text}
					mainImage={mainImage}
					imagesUrl={imagesUrl}
					onNewComment={onNewComment}
        />

        <div className={styles.heartComment}>
					<HeartCommentAndReview isCommentLiked={isLiked} commentId={id} heartsCount={hearts} />
        </div>
      </div>
    </div>
  );
};


export default CommentItem;
