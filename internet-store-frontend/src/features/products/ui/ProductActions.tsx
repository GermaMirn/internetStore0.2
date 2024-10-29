import React from 'react';
import AddRemoveQuantityOfProducts from '../../../shared/ui/AddRemoveQuantityOfProducts/AddRemoveQuantityOfProducts';
import Button from '../../../shared/ui/Button';
import Heart from '../../../shared/ui/Heart/Heart';
import styles from './ProductActions.module.css';

interface ProductActionsProps {
  isInCart: boolean;
  cartQuantity: number;
  itemId: number;
  onAddToCart: () => void;
  productId: number;
  isHearted: boolean;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onToggleHeart: (newLikedState: boolean) => Promise<void>;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  isInCart,
  cartQuantity,
  itemId,
  onAddToCart,
  productId,
  isHearted,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onToggleHeart,
}) => {
  return (
    <div className={styles.divForButtonsAndHeart}>
      {isInCart ? (
        <AddRemoveQuantityOfProducts
          countOfProduct={cartQuantity}
          cartItemId={itemId}
          onIncrease={onIncreaseQuantity}
          onDecrease={onDecreaseQuantity}
        />
      ) : (
        <div onClick={onAddToCart}>
          <Button icon={'/header/shoppingCart.svg'} color={'color'} />
        </div>
      )}
      <div className={styles.heart}>
        <Heart productId={productId} isProductLiked={isHearted} onToggleLike={onToggleHeart} />
      </div>
    </div>
  );
};

export default ProductActions;
