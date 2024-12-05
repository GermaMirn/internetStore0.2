import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OrderCard.module.css';
import { ProductImageProps } from '../../../interfaces';


const ProductImage: React.FC<ProductImageProps> = ({ productId, imageUrl }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.productImageContainer}>
      <img
        className={styles.productImg}
        src={imageUrl}
        alt="img"
        onClick={() => navigate(`/product/${productId}`)}
      />
      <div className={styles.hoverText} onClick={() => navigate(`/product/${productId}`)}>
        <p className={styles.hoverTextP}>См. товар</p>
      </div>
    </div>
  );
};


export default ProductImage;
