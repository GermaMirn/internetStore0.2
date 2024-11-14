import React, { useState } from 'react';
import styles from './ImageModal.module.css';
import { formatDate } from './utils/dateUtils';
import { ImageModalProps } from '../../../../interfaces';
import { formatCommentText } from './utils/formatCommentText';


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
  const baseUrl = "http://127.0.0.1:8000";
  const currentImage = images[currentIndex];

  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;

  const displayedText = isExpanded ? text : `${(text as string).slice(0, maxLength)}`;


  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageContainer}>
          <img src={baseUrl + currentImage} alt="Preview" className={styles.modalImage} />
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
          </p>
        </div>
      </div>
    </div>
  );
};


export default ImageModal;
