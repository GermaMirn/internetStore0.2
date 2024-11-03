import React from 'react';
import styles from './Comment.module.css';
import { formatDate } from '../dateUtils';
import HeartCommentAndReview from '../Heart';


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


const CommentItem: React.FC<Comment> = ({ id, user, text, created_at, hearts, isLiked }) => {
  return (
    <div className={styles.mainDivComment}>
      <div className={styles.comment}>
        <div className={styles.logoUser}>
          <img className={styles.logo} src="/user/userLogo.svg" alt="user photo" />
        </div>

        <div className={styles.dataComment}>
          <h3 className={styles.userNameComment}>{user}</h3>
          <h5 className={styles.dateComment}>{formatDate(created_at)}</h5>
          <p className={styles.textComment}>{text}</p>
        </div>

        <div className={styles.heartComment}>
					<HeartCommentAndReview isCommentLiked={isLiked} commentId={id} heartsCount={hearts} />
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
