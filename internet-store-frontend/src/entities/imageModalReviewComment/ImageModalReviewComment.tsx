import React, { useState, useEffect } from 'react';
import styles from './ImageModalReviewComment.module.css';
import { formatDate } from '../reviewCommentData/utils/dateUtils';
import { ImageModalProps } from '../../interfaces';
import { formatCommentText } from '../reviewCommentData/utils/formatCommentText';
import { baseURL } from '../../shared/api/axiosInstance';


const ImageModal: React.FC<ImageModalProps> = ({
	images,
	user,
	created_at,
	text,
	currentIndex,
	onNext,
	onPrev,
	onClose
}) => {
  const currentImage = images[currentIndex];

  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;

  const displayedText = isExpanded ? text : `${(text as string).slice(0, maxLength)}`;

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setIsExpanded(false);
  }, [currentIndex]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageContainer}>
          <img src={baseURL + currentImage} alt="Preview" className={styles.modalImage} />
          <button onClick={onPrev} disabled={currentIndex === 0} className={`${styles.navButton} ${styles.leftButton}`}>←</button>
          <button onClick={onNext} disabled={currentIndex === images.length - 1} className={`${styles.navButton} ${styles.rightButton}`}>→</button>
        </div>

        <div className={styles.dataCommentReview}>
          <div className={styles.headerCommentReview}>
            <h3>{user}</h3>
            <p className={styles.currentImage}>{currentIndex + 1} из {images.length}</p>
            <p className={styles.timestamp}>{formatDate(created_at)}</p>
          </div>
          <p className={styles.mainTextCommentReview}>
            {formatCommentText(displayedText)}
            { !isExpanded && text.length > maxLength && (
              <span onClick={toggleText} className={styles.expandText}> ....</span>
            )}
            { isExpanded && (
              <span onClick={toggleText} className={styles.expandText}> Закрыть</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};


export default ImageModal;
