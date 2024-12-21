import React, { useState } from 'react';
import { formatDate } from './utils/dateUtils';
import { ReviewDataProps } from '../../../../interfaces';
import { addComment } from '../../api/addCommentReview/addComment';
import { formatCommentText } from './utils/formatCommentText';
import styles from './ReviewCommentData.module.css';
import ImageModal from './ImageModalReviewComment';
import FormForSendNewCommentReview from '../../../../entities/Comment/FormForSendNewCommentReview';
import ImageViewer from './ImageViewer';
import CommentActions from '../../../../entities/Comment/CommentActions';
import { useNotification } from '../../../../app/providers/notifications/NotificationProvider';


const ReviewCommentData: React.FC<ReviewDataProps> = ({
  isReview,
  user,
  created_at,
  text,
  imagesUrl = [],
  reviewId,
  comments = [],
  showComments = false,
  toggleComments = () => {},
	onNewComment = () => {},
}) => {
  const token = localStorage.getItem('token');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const allImages = [...imagesUrl].filter(image => image);
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
	const [commentsList, setCommentsList] = useState(comments);
	const { showNotification } = useNotification();

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleReplyClick = () => {
    setIsReplyFormOpen((prev) => !prev);
  };

  const handleSubmitComment = async (commentText: string, images: File[]) => {
    try {
      if (reviewId !== undefined) {
        let formData = new FormData();
        formData.append('comment', commentText);
        images.forEach(image => {
          formData.append('image', image);
        });

        const newComment = await addComment(String(reviewId), formData);
        if (onNewComment) {
          onNewComment(newComment);
					setCommentsList((newComments) => [...newComments, newComment])
        }

        setIsReplyFormOpen(false);
      } else {
        console.error('Review ID is undefined');
      }
    } catch (error) {
      showNotification('Не получилось добавить комментарий', 'error');
    }
  };

  return (
    <div className={styles.review}>
      <div className={styles.logoUser}>
        <img className={styles.logo} src="/user/userLogo.svg" alt="user photo" />
      </div>

      <div className={styles.dataReview}>
        <div className={styles.divForUserNameReviewCommentAndImages}>
          <h3 className={styles.userNameReview}>{user}</h3>

          {imagesUrl.length > 0 && (
            <ImageViewer images={imagesUrl} onOpenModal={openModal} />
          )}
        </div>
        <h5 className={styles.dateReview}>{formatDate(created_at)}</h5>
        <p className={styles.textReview}>{formatCommentText(text)}</p>

				<CommentActions
					commentsCount={commentsList.length}
					showComments={showComments}
					isReplyFormOpen={isReplyFormOpen}
					token={token}
					isReview={isReview}
					onToggleComments={toggleComments}
					onReplyClick={handleReplyClick}
				/>

        {isReplyFormOpen && token && (
          <FormForSendNewCommentReview
            onClose={() => setIsReplyFormOpen(false)}
            onSubmit={handleSubmitComment}
            isReplyToComment={!isReview}
            username={user}
          />
        )}
      </div>

      {isModalOpen && (
        <ImageModal
          user={user}
          text={text}
          created_at={created_at}
          images={allImages}
          currentIndex={selectedImageIndex}
          onClose={closeModal}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
};


export default ReviewCommentData;
