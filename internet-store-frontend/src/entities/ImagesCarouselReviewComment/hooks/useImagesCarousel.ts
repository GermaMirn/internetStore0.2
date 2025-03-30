import { useState } from 'react';
import { baseURL } from '../../../shared/api/axiosInstance';
import { ImagesCarouselProps } from '../../../interfaces';

export const useImagesCarousel = ({ imagesUrl, mainImage, onImageSelect }: ImagesCarouselProps) => {
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
  console.log()
  return {
    images,
    selectedIndex,
    baseURL,
    handleImageClick,
    handleNextImage,
    handlePreviousImage,
  };
};
