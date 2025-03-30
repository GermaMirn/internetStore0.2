import React from 'react';
import styles from './ImagesCarouselReviewComment.module.css';
import { useImagesCarousel } from '../hooks/useImagesCarousel';
import { ImagesCarouselProps } from '../../../interfaces';


const ImagesCarousel: React.FC<ImagesCarouselProps> = (props) => {
  const { images, selectedIndex, baseURL, handleImageClick, handleNextImage, handlePreviousImage } = useImagesCarousel(props);

  return (
    <div className={styles.imagesCarousel}>
      <img
        className={styles.changePhotoUp}
        src="/product/changeUp.svg"
        alt="Previous"
        onClick={handlePreviousImage}
      />

      <div className={styles.scrollWrapper}>
        <div className={styles.scrollContent}>
          {images.map((imageUrl, index) => (
            <img
              key={index}
              className={`${styles.imageCarousel} ${selectedIndex === index ? styles.activeImage : ''}`}
              src={baseURL + imageUrl}
              alt={`Image ${index + 1}`}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
      </div>

      <img
        className={styles.changePhotoDown}
        src="/product/changeDown.svg"
        alt="Next"
        onClick={handleNextImage}
      />
    </div>
  );
};


export default ImagesCarousel;
