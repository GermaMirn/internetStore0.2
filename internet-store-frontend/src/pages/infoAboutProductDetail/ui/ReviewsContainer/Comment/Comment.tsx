import React from 'react';
import styles from './Comment.module.css';
import HeartCommentAndReview from '../Heart';
import ReviewData from '../ReviewCommentData';


export interface Comment {
  id: number;
  user: string;
  text: string;
  created_at: string;
  hearts: number;
	isLiked: boolean;
  imagesUrl: string[];
  mainImage: string | null;
}


const CommentItem: React.FC<Comment> = ({ id, user, text, created_at, hearts, isLiked, mainImage, imagesUrl}) => {
  return (
    <div className={styles.mainDivComment}>
      <div className={styles.comment}>
				<ReviewData
					isReview={false}
          user={user}
          created_at={created_at}
          text={text}
					mainImage={mainImage}
					imagesUrl={imagesUrl}
        />

        <div className={styles.heartComment}>
					<HeartCommentAndReview isCommentLiked={isLiked} commentId={id} heartsCount={hearts} />
        </div>
      </div>
    </div>
  );
};


export default CommentItem;
