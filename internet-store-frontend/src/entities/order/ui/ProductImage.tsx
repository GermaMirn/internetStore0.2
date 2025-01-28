import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OrderCard/OrderCard.module.css';
import { ProductImageProps } from '../../../interfaces';


const ProductImage: React.FC<ProductImageProps> = ({ productId, imageUrl, isMobile=false }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.productImageContainer}>
      <img
        className={isMobile ? styles.productImgMobile : styles.productImg}
        src={imageUrl}
        alt="img"
        onClick={() => navigate(`/product/${productId}`)}
      />
      <div className={isMobile ? styles.hoverTextMobile : styles.hoverText} onClick={() => navigate(`/product/${productId}`)}>
        <p className={isMobile ? styles.hoverTextPMobile : styles.hoverTextP}>см. товар</p>
      </div>
    </div>
  );
};


export default ProductImage;
