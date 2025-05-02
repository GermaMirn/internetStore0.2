import React, { useState } from 'react';
import { formatDate } from './utils/dateUtils';
import { ReviewDataMobileProps } from '../../interfaces';
import { addComment } from '../../pages/infoAboutProductDetail/api/addCommentReview/addComment';
import { formatCommentText } from './utils/formatCommentText';
import styles from './ReviewCommentDataMobile.module.css';
import ImageModal from '../imageModalReviewComment/ImageModalReviewComment';
import FormForSendNewCommentReview from '../formForSendNewReviewComment/FormForSendNewCommentReview';
import ImageViewer from '../../shared/ui/ImageViewer/ImageViewer';
import CommentActions from '../commentActions/CommentActions';
import { useNotification } from '../../app/providers/notifications/NotificationProvider';
import HeartCommentAndReview from '../heartCommentAndReview/HeartCommentAndReview';


const ReviewCommentDataMobile: React.FC<ReviewDataMobileProps> = ({
  id,
  hearts,
  isLiked,
  commentIsLiked,
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
  handleLikeToggle = () => {},
  setIsLiked = () => {},
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
        const formData = new FormData();
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
    } catch {
      showNotification('Не получилось добавить комментарий', 'error');
    }
  };

  return (
    <div className={styles.review}>
      <div className={styles.logoUser}>
        <img className={styles.logo} src="/user/userLogo2.svg" alt="user photo" />
      </div>

      <div className={styles.dataReview}>
        <div className={styles.divForUserNameReviewCommentAndImages}>
          <h3 className={styles.userNameReview}>{user}</h3>
          <h5 className={styles.dateReview}>{formatDate(created_at)}</h5>

          {isReview ? (
            <div className={styles.heartReview} onClick={handleLikeToggle}>
              <HeartCommentAndReview isReviewLiked={isLiked} reviewId={id} heartsCount={hearts} />
            </div>
          ) : (
            <div className={styles.heartReview} onClick={() => setIsLiked(!commentIsLiked)}>
              <HeartCommentAndReview isReviewLiked={commentIsLiked} commentId={id} heartsCount={hearts} />
            </div>
          )}
        </div>
        <p className={styles.textReview}>{formatCommentText(text)}</p>

        <div className={styles.reviewImagesMobile}>
          {imagesUrl.length > 0 && (
            <ImageViewer images={imagesUrl} onOpenModal={openModal} />
          )}
        </div>

        <div className={styles.commentActionsMobile}>
          <CommentActions
            isMobile={true}
            commentsCount={commentsList.length}
            showComments={showComments}
            isReplyFormOpen={isReplyFormOpen}
            token={token}
            isReview={isReview}
            onToggleComments={toggleComments}
            onReplyClick={handleReplyClick}
          />
        </div>

          {isReplyFormOpen && token && (
            <div className={styles.replyForm}>
              <FormForSendNewCommentReview
                onClose={() => setIsReplyFormOpen(false)}
                onSubmit={handleSubmitComment}
                isReplyToComment={!isReview}
                username={user}
              />
            </div>
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


export default ReviewCommentDataMobile;
