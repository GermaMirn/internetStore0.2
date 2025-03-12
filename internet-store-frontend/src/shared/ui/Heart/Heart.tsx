import React, { useState, useEffect } from 'react';
import styles from './Heart.module.css';
import classNames from 'classnames';
import { addHeart } from '../../api/Heart/addHeart';
import { removeHeart } from '../../api/Heart/removeHeart';
import { HeartProductProps } from '../../../interfaces';
import { useNotification } from '../../../app/providers/notifications/NotificationProvider';


const DivForFullHeart: React.FC<HeartProductProps> = ({ isProductLiked = false, productId, onToggleLike }) => {
  const [isLiked, setIsLiked] = useState(isProductLiked);
  const [isLoading, setIsLoading] = useState(false);
	const { showNotification } = useNotification();

  useEffect(() => {
    setIsLiked(isProductLiked);
  }, [isProductLiked]);

  const toggleLike = async () => {
    setIsLoading(true);
    try {
      const newLikedState = !isLiked;

      if (newLikedState) {
        await addHeart(productId);
      } else {
        await removeHeart(productId);
      }

      if (onToggleLike) {
        await onToggleLike(newLikedState);
      } else {
        setIsLiked(newLikedState);
      }
    } catch {
      showNotification('Ошибка при изменении статуса лайка', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={classNames(
        styles.heartContainer,
        { [styles.liked]: isLiked },
        { [styles.notLiked]: !isLiked }
      )}
      onClick={toggleLike}
    >
      {isLoading ? (
        <img className={styles.heartIcon} src={'/product/fullHeart.svg'} alt="Liked" />
      ) : isLiked ? (
        <img className={styles.heartIcon} src={'/product/fullHeart.svg'} alt="Liked" />
      ) : (
        <img className={styles.heartIcon} src={'/product/emptyHeart.svg'} alt="Not liked" />
      )}
    </div>
  );
};


export default DivForFullHeart;
