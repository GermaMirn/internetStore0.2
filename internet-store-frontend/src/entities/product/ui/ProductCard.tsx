import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';
import Button from '../../../shared/ui/Button';
import ProductActions from '../../../features/products/ui/ProductActions';


export interface Product {
  id: number;
  mainImageUrl: string;
  name: string;
  description: string;
  price: string;
  isHearted: boolean;
  isInCart: boolean;
  cartQuantity: number;
  cartItemId: number;
}


interface ProductCardProps {
  product: Product;
  onQuickViewOpen: () => void;
}


const baseUrl = 'http://127.0.0.1:8000';


const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickViewOpen,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickViewClick = () => {
    onQuickViewOpen();
  };

  return (
    <div className={styles.productCard}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          className={styles.imgOfProduct}
          src={`${baseUrl}${product.mainImageUrl}`}
          alt={product.name}
          onClick={() => navigate(`/product/${product.id}`)}
        />

        {isHovered && (
          <div className={styles.fastView} onClick={handleQuickViewClick}>
            <Button text="Быстрый просмотр" size="small" />
          </div>
        )}
      </div>

      <p className={styles.nameOfProduct}>{product.name}</p>
      <h2>{product.price} ₽</h2>

      <ProductActions
        isInCart={product.isInCart}
        cartQuantity={product.cartQuantity}
        itemId={product.cartItemId}
        productId={product.id}
        isHearted={product.isHearted}
      />
    </div>
  );
};


export default ProductCard;
