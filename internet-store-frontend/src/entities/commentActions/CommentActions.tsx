import React from 'react';
import styles from './CommentActions.module.css';
import { CommentActionsProps } from "../../interfaces"


const CommentActions: React.FC<CommentActionsProps> = ({
  isMobile = false,
  onToggleComments,
  commentsCount,
  showComments,
  onReplyClick,
  token,
	isReview = true
}) => {
  return (
    <div className={isMobile ? styles.divReviewCommentActionsMobile : styles.divReviewCommentActions}>
      {token && (
        <div className={styles.openReviewForm} onClick={onReplyClick}>
          <p className={styles.divCommentText}>Ответить</p>
          <img className={styles.imgOfReviewForm} src="/product/chat.svg" alt="chat" />
        </div>
      )}

      {commentsCount > 0 && isReview && (
        <div className={styles.divComment} onClick={onToggleComments}>
          <p className={styles.divCommentText}>{commentsCount} ответов</p>
          <img
            className={`${styles.openComments} ${showComments ? styles.rotate : ''}`}
            src="/product/changeDown.svg"
            alt="open comments"
          />
        </div>
      )}
    </div>
  );
};


export default CommentActions;
