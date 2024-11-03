import React, { useState } from 'react';
import AddRemoveQuantityOfProducts from '../../../shared/ui/AddRemoveQuantityOfProducts/AddRemoveQuantityOfProducts';
import Button from '../../../shared/ui/Button';
import Heart from '../../../shared/ui/Heart/Heart';
import styles from './ProductActions.module.css';
import { addProductToCart } from '../../../shared/api/removeAddProductToCart/addProductToCart';

interface ProductActionsProps {
  productId: number;
  isInCart: boolean;
  cartQuantity: number;
	itemId: number;
  isHearted: boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  productId,
  isInCart,
  cartQuantity,
	itemId,
  isHearted,
}) => {
  const [isInCartProduct, setIsInCart] = useState(isInCart);
  const [cartQuantityProduct, setCartQuantity] = useState(cartQuantity);
  const [isHeartedProduct, setIsHearted] = useState(isHearted);
  const [cartItemId, setCartItemId] = useState(itemId);

  const handleAddToCart = async () => {
    try {
      const answer = await addProductToCart(productId);
      setCartItemId(answer.item.id);
      setIsInCart(true);
      setCartQuantity(1);
    } catch (error) {
      console.error('Ошибка при добавлении товара в корзину', error);
    }
  };

  const handleIncreaseQuantity = () => {
    setCartQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setCartQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleToggleHeart = async () => {
    setIsHearted((prev) => !prev);
  };

  return (
    <div className={styles.divForButtonsAndHeart}>
      {isInCartProduct ? (
        <AddRemoveQuantityOfProducts
          countOfProduct={cartQuantityProduct}
          cartItemId={cartItemId}
          onIncrease={handleIncreaseQuantity}
          onDecrease={handleDecreaseQuantity}
        />
      ) : (
        <div onClick={handleAddToCart}>
          <Button icon={'/header/shoppingCart.svg'} color={'color'} />
        </div>
      )}
      <div className={styles.heart}>
        <Heart productId={productId} isProductLiked={isHeartedProduct} onToggleLike={handleToggleHeart} />
      </div>
    </div>
  );
};

export default ProductActions;
