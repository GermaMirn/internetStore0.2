import React, { useState, useEffect } from 'react';
import AddRemoveQuantityOfProducts from '../../../shared/ui/AddRemoveQuantityOfProducts/AddRemoveQuantityOfProducts';
import Button from '../../../shared/ui/Button';
import Heart from '../../../shared/ui/Heart/Heart';
import styles from './ProductActions.module.css';
import { addProductToCart } from '../../../shared/api/removeAddProductToCart/addProductToCart';
import { ProductActionsProps } from '../../../interfaces';
import { useNotification } from '../../../app/providers/notifications/NotificationProvider';


const ProductActions: React.FC<ProductActionsProps> = ({
  productId,
  isInCart,
  cartQuantity,
  itemId,
  isHearted,
  updateCartState,
  updateHeartState,
}) => {
  const [isInCartProduct, setIsInCart] = useState(isInCart);
  const [cartQuantityProduct, setCartQuantity] = useState(cartQuantity);
  const [isHeartedProduct, setIsHearted] = useState(isHearted);
	const { showNotification } = useNotification();

  useEffect(() => {
    setIsInCart(isInCart);
    setCartQuantity(cartQuantity);
  }, [isInCart, cartQuantity, isHearted]);

  const handleAddToCart = async () => {
    try {
      const answer = await addProductToCart(productId);
      setIsInCart(true);
      setCartQuantity(1);
      updateCartState?.(true, 1, answer.item.id);
    } catch {
			setIsInCart(false);
      showNotification('Ошибка при добавлении товара в корзину', 'error');
    }
  };

  const handleIncreaseQuantity = () => {
    const newQuantity = cartQuantityProduct + 1;
    setCartQuantity(newQuantity);
    updateCartState?.(isInCartProduct, newQuantity, itemId);
  };

  const handleDecreaseQuantity = () => {
    const newQuantity = Math.max(cartQuantityProduct - 1, 1);
    setCartQuantity(newQuantity);
    updateCartState?.(isInCartProduct, newQuantity, itemId);
  };

  const handleToggleHeart = async () => {
    const newIsHearted = !isHeartedProduct;
    setIsHearted(newIsHearted);
		updateHeartState?.(newIsHearted);
  };

  return (
    <div className={styles.divForButtonsAndHeart}>
      {isInCartProduct ? (
        <AddRemoveQuantityOfProducts
          countOfProduct={cartQuantityProduct}
          cartItemId={itemId}
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
