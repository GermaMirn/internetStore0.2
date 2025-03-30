import React from 'react';
import styles from './ImagesCarouselReviewCommentMobile.module.css';
import { useImagesCarousel } from '../hooks/useImagesCarousel';
import { ImagesCarouselProps } from '../../../interfaces';


const ImagesCarouselMobile: React.FC<ImagesCarouselProps> = (props) => {
  const { images, selectedIndex, baseURL, handleImageClick, handleNextImage, handlePreviousImage } =
    useImagesCarousel(props);

  const renderCircleIndicators = () => {
    const totalImages = images.length;

    if (totalImages <= 4) {
      return images.map((_, index) => (
        <div
          key={index}
          className={`${styles.circleIndicator} ${
            selectedIndex === index ? styles.activeCircle : ''
          }`}
          onClick={() => handleImageClick(index)}
        />
      ));
    }

    const indicators = [];
    const halfIndex = Math.floor(totalImages / 2);

    indicators.push(
      <div
        key={0}
        className={`${styles.circleIndicator} ${selectedIndex === 0 ? styles.activeCircle : ''}`}
        onClick={() => handleImageClick(0)}
      />
    );

    indicators.push(
      <div
        key={1}
        className={`${styles.circleIndicator} ${
          selectedIndex > 0 && selectedIndex < halfIndex ? styles.activeCircle : ''
        }`}
        onClick={() => handleImageClick(halfIndex - 1)}
      />
    );

    indicators.push(
      <div
        key={2}
        className={`${styles.circleIndicator} ${
          selectedIndex >= halfIndex && selectedIndex < totalImages - 1 ? styles.activeCircle : ''
        }`}
        onClick={() => handleImageClick(halfIndex)}
      />
    );

    indicators.push(
      <div
        key={3}
        className={`${styles.circleIndicator} ${
          selectedIndex === totalImages - 1 ? styles.activeCircle : ''
        }`}
        onClick={() => handleImageClick(totalImages - 1)}
      />
    );

    return indicators;
  };

  return (
    <div className={styles.imagesCarousel}>
      <img
        className={styles.changePhotoLeft}
        src="/product/changeLeft.svg"
        alt="Previous"
        onClick={handlePreviousImage}
      />

      <div className={styles.mainImageWrapper}>
        <img
          className={styles.mainImage}
          src={baseURL + images[selectedIndex]}
          alt={`Image ${selectedIndex + 1}`}
          onClick={() => handleImageClick(selectedIndex)}
        />
        <div className={styles.circleIndicatorContainer}>
          {renderCircleIndicators()}
        </div>
      </div>

      <img
        className={styles.changePhotoRigth}
        src="/product/changeRigth.svg"
        alt="Next"
        onClick={handleNextImage}
      />
    </div>
  );
};


export default ImagesCarouselMobile;
