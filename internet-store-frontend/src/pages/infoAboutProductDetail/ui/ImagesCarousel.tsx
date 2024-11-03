import React, { useState } from 'react';
import styles from './ImagesCarousel.module.css';


interface ImagesCarouselProps {
  imagesUrl: string[];
  mainImage: string;
  onImageSelect: (imageUrl: string) => void;
}


const ImagesCarousel: React.FC<ImagesCarouselProps> = ({ imagesUrl, mainImage, onImageSelect }) => {
  const baseURL = 'http://127.0.0.1:8000';
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const images = [mainImage, ...imagesUrl];

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    onImageSelect(images[index]);
  };

  const handleNextImage = () => {
    if (selectedIndex < images.length - 1) {
      handleImageClick(selectedIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (selectedIndex > 0) {
      handleImageClick(selectedIndex - 1);
    }
  };

  return (
    <div className={styles.imagesCarousel}>
      <img
        className={styles.changePhotoUp}
        src="/product/changeUp.svg"
        alt=""
        onClick={handlePreviousImage}
      />

      {images.map((imageUrl, index) => (
        <img
          key={index}
          className={`${styles.imageCarousel} ${selectedIndex === index ? styles.activeImage : ''}`}
          src={baseURL + imageUrl}
          alt={`Image ${index + 1}`}
          onClick={() => handleImageClick(index)}
        />
      ))}

      <img
        className={styles.changePhotoDown}
        src="/product/changeDown.svg"
        alt=""
        onClick={handleNextImage}
      />
    </div>
  );
};


export default ImagesCarousel;
