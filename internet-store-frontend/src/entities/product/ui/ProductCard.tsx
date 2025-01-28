import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';
import Button from '../../../shared/ui/Button';
import ProductActions from '../../../features/products/ui/ProductActions';
import { ProductCardProps } from '../../../interfaces'
import { baseURL } from '../../../shared/api/axiosInstance';
import { refactorText } from '../utils/refactorText';


const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickViewOpen,
	updateCartState,
  updateHeartState,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={styles.productCard}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          className={styles.imgOfProduct}
          src={`${baseURL}${product.mainImageUrl}`}
          alt={product.name}
          onClick={() => navigate(`/product/${product.id}`)}
        />

        {isHovered && (
          <div className={styles.fastView} onClick={onQuickViewOpen}>
            <Button text="Быстрый просмотр" size="small" />
          </div>
        )}
      </div>

      <p className={styles.nameOfProduct}>{refactorText(product.name)}</p>
      <h2 className={styles.productPrice}>{product.price} ₽</h2>

			<div className={styles.actions}>
				<ProductActions
					isInCart={product.isInCart}
					cartQuantity={product.cartQuantity}
					itemId={product.cartItemId}
					productId={product.id}
					isHearted={product.isHearted}
					updateCartState={updateCartState}
					updateHeartState={updateHeartState}
				/>
			</div>
    </div>
  );
};


export default ProductCard;
