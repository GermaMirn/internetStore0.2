import React from 'react';
import styles from './ImageViewer.module.css';
import { ImageViewerProps } from '../../../../interfaces';
import { baseURL } from '../../../../shared/api/axiosInstance';


const ImageViewer: React.FC<ImageViewerProps> = ({ images, onOpenModal }) => {
  return (
    <div className={styles.imagesCommentReview}>
      {images.length > 0 && images.map((image, index) => (
        <img
          key={index}
          className={styles.imgageCommentReview}
          src={baseURL + image}
          alt="img"
          onClick={() => onOpenModal(index)}
        />
      ))}
    </div>
  );
};


export default ImageViewer;
