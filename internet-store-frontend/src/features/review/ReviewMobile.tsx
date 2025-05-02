import React, { useState } from 'react';
import styles from './ReviewMobile.module.css';
import Comment from '../comment/CommentMobile';
import ReviewCommentDataMobile from '../../entities/reviewCommentData/ReviewCommentDataMobile';
import { ReviewItemProps, CommentProps } from '../../interfaces';

const ReviewMobile: React.FC<ReviewItemProps> = ({
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
  // Состояние для хранения лайков комментариев
  const [commentLikesState, setCommentLikesState] = useState<{
    [commentId: number]: boolean
  }>(() => {
    // Инициализируем состояние лайков из пропсов комментариев
    const initialState: { [commentId: number]: boolean } = {};
    comments.forEach(comment => {
      initialState[comment.id] = comment.isLiked || false;
    });
    return initialState;
  });

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleLikeToggle = () => {
    const newLikes = isLiked ? hearts - 1 : hearts + 1;
    updateReviewLikes(id, newLikes);
    setIsLiked(id, !isLiked);
  };

  // Обработчик лайков для комментариев
  const handleCommentLikeToggle = (commentId: number, currentLikedState: boolean) => {
    setCommentLikesState(prev => ({
      ...prev,
      [commentId]: !currentLikedState
    }));
    // Здесь можно добавить вызов API для обновления лайков на сервере
  };

  const handleNewComment = (newComment: CommentProps) => {
    setUpdatedComments((prevComments) => [...prevComments, newComment]);
    // Инициализируем состояние лайка для нового комментария
    setCommentLikesState(prev => ({
      ...prev,
      [newComment.id]: newComment.isLiked || false
    }));
  };

  return (
    <div className={styles.mainDivReview}>
      <div className={styles.review}>
        <ReviewCommentDataMobile
          id={id}
          hearts={hearts}
          isLiked={isLiked}
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
          handleLikeToggle={handleLikeToggle}
        />
      </div>

      {showComments && updatedComments.length > 0 && (
        <div className={styles.divForComments}>
          {updatedComments.map((comment) => (
            <Comment
              key={comment.id}
              {...comment}
              reviewId={id}
              onNewComment={handleNewComment}
              isLiked={commentLikesState[comment.id] || false}
              setIsLiked={(isLiked: boolean) => handleCommentLikeToggle(comment.id, isLiked)}
            />
          ))}
        </div>
      )}
      <hr />
    </div>
  );
};

export default ReviewMobile;
