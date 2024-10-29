import React from 'react';
import { Product } from './ProductCard';
import styles from './QuickView.module.css';
import Cross from '../../../shared/ui/Cross/Cross';
import ProductActions from '../../../features/products/ui/ProductActions';


interface QuickViewProps {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
  onToggleHeart: () => void;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
}


const baseUrl = 'http://127.0.0.1:8000';


const QuickView: React.FC<QuickViewProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleHeart,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) => {
  return (
    <div className={styles.quickViewOverlay}>
      <div className={styles.quickView}>
        <img className={styles.imgOfQuickView} src={`${baseUrl}${product.mainImageUrl}`} alt={product.name} />
        <div className={styles.textOfQuickView}>
          <h2 className={styles.nameOfProduct}>{product.name}</h2>
          <h1 className={styles.priceOfQuickView}>{product.price} ₽</h1>
          <h2>О товаре</h2>
          <h4 className={styles.descriptionOfQuickView}>{product.description}</h4>

          <ProductActions
            isInCart={product.isInCart}
            cartQuantity={product.cartQuantity}
            itemId={product.cartItemId}
            onAddToCart={onAddToCart}
            productId={product.id}
            isHearted={product.isHearted}
            onIncreaseQuantity={onIncreaseQuantity}
            onDecreaseQuantity={onDecreaseQuantity}
            onToggleHeart={async () => await onToggleHeart()}
          />
        </div>
      </div>
      <div onClick={onClose} className={styles.cross}>
        <Cross size="medium" />
      </div>
    </div>
  );
};


export default QuickView;
