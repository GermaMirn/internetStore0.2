import React from 'react';
import styles from './ImageViewer.module.css';


interface ImageViewerProps {
  images: string[];
  onOpenModal: (index: number) => void;
  baseUrl: string;
}


const ImageViewer: React.FC<ImageViewerProps> = ({ images, onOpenModal, baseUrl }) => {
  return (
    <div className={styles.imagesCommentReview}>
      {images.length > 0 && images.map((image, index) => (
        <img
          key={index}
          className={styles.imgageCommentReview}
          src={baseUrl + image}
          alt="img"
          onClick={() => onOpenModal(index)}
        />
      ))}
    </div>
  );
};


export default ImageViewer;
