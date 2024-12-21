import React, { useState } from 'react';
import styles from './ImagesCarouselReviewComment.module.css';
import { ImagesCarouselProps } from '../../interfaces';
import { baseURL } from '../../shared/api/axiosInstance';


const ImagesCarousel: React.FC<ImagesCarouselProps> = ({ imagesUrl, mainImage, onImageSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const images = [mainImage, ...imagesUrl];

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    onImageSelect(images[index]);
  };

  const handleNextImage = () => {
    const nextIndex = (selectedIndex + 1) % images.length;
    setSelectedIndex(nextIndex);
    onImageSelect(images[nextIndex]);
  };

  const handlePreviousImage = () => {
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(prevIndex);
    onImageSelect(images[prevIndex]);
  };

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
