import React from 'react';
import styles from './ImagePreviewModal.module.css';

interface ImagePreviewModalProps {
  images: File[];
  message: string;
  onMessageChange: (val: string) => void;
  onClose: () => void;
  onSend: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  images,
  message,
  onMessageChange,
  onClose,
  onSend,
}) => {
  const imageUrls = images.map(file => URL.createObjectURL(file));

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <div className={styles.imagesPreview}>
          {imageUrls.map((url, idx) => (
            <img key={idx} src={url} alt="preview" className={styles.image} />
          ))}
        </div>

        <div className={styles.actions}>
          <input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Введите сообщение"
            className={styles.input}
          />
          <img className={styles.sendMessage} onClick={onSend} src="/chat/send2.svg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
