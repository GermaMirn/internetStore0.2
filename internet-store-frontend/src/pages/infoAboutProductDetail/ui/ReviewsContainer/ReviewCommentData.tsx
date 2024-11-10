import React, { useState } from 'react';
import styles from './ReviewCommentData.module.css';
import { formatDate } from './utils/dateUtils';
import ImageModal from './ImageModal';
import { ReviewDataProps } from '../../../../interfaces';



const ReviewData: React.FC<ReviewDataProps> = ({ isReview, user, created_at, text, mainImage = '', imagesUrl = [], comments = [], showComments = false, toggleComments = () => {} }) => {
  const baseUrl = 'http://127.0.0.1:8000/';
  const token = localStorage.getItem('token');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const allImages = [...imagesUrl].filter(image => image);

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

  return (
    <div className={styles.review}>
      <div className={styles.logoUser}>
        <img className={styles.logo} src="/user/userLogo.svg" alt="user photo" />
      </div>

      <div className={styles.dataReview}>
        <div className={styles.divForUserNameReviewCommentAndImages}>
          <h3 className={styles.userNameReview}>{user}</h3>

          {mainImage && (
            <div className={styles.imagesCommentReview}>
              {imagesUrl.length > 0 && imagesUrl.map((image: string, index: number) => (
                <img
                  key={index}
                  className={styles.imgageCommentReview}
                  src={baseUrl + image}
                  alt="img"
                  onClick={() => openModal(index)}
                />
              ))}
            </div>
          )}
        </div>
        <h5 className={styles.dateReview}>{formatDate(created_at)}</h5>
        <p className={styles.textReview}>{text}</p>

        {isReview && (
          <div className={styles.divReviewCommentActions}>
            {comments.length > 0 && toggleComments && (
              <div className={styles.divComment} onClick={toggleComments}>
                <p className={styles.divCommentText}>{comments.length} ответов</p>
                <img
                  className={`${styles.openComments} ${showComments ? styles.rotate : ''}`}
                  src="/product/changeDown.svg"
                  alt="open comments"
                />
              </div>
            )}

            {token && (
              <div className={styles.openReviewForm}>
                <p className={styles.divCommentText}>Ответить</p>
                <img className={styles.imgOfReviewForm} src="/product/chat.svg" alt="chat" />
              </div>
            )}
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


export default ReviewData;
