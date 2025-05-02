import React from 'react';
import styles from './CommentMobile.module.css';
import ReviewCommentDataMobile from '../../entities/reviewCommentData/ReviewCommentDataMobile';
import { CommentProps } from '../../interfaces';


const CommentMobile: React.FC<CommentProps> = ({
	id,
	reviewId,
	user,
	text,
	created_at,
	hearts,
	isLiked,
	mainImage,
	imagesUrl,
	onNewComment,
  handleLikeToggle,
  setIsLiked,
}) => {
  return (
    <div className={styles.mainDivComment}>
      <div className={styles.comment}>
				<ReviewCommentDataMobile
          id={id}
          hearts={hearts}
          commentIsLiked={isLiked}
					isReview={false}
					reviewId={reviewId}
          user={user}
          created_at={created_at}
          text={text}
					mainImage={mainImage}
					imagesUrl={imagesUrl}
					onNewComment={onNewComment}
          handleLikeToggle={handleLikeToggle}
          setIsLiked={setIsLiked}
        />
      </div>
    </div>
  );
};


export default CommentMobile;
