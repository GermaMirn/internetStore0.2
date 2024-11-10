import React from 'react';
import styles from './ImageModal.module.css';
import { formatDate } from './utils/dateUtils';


interface ImageModalProps {
  images: string[];
  currentIndex: number;
	created_at: string;
  user: string;
  text: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}


const ImageModal: React.FC<ImageModalProps> = ({ images, user, created_at, text, currentIndex, onNext, onPrev, onClose }) => {
  const baseUrl = "http://127.0.0.1:8000/";
  const currentImage = images[currentIndex];

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
          <p className={styles.mainTextCommentREview}>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
