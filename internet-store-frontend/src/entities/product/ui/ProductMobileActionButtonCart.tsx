import React, { useEffect, useState } from 'react';
import styles from './ProductMobileActionButtonCart.module.css';
import { ProductMobileActionButtonCartProps } from '../../../interfaces';
import { addProductToCart } from '../../../shared/api/removeAddProductToCart/addProductToCart';
import { useNotification } from '../../../app/providers/notifications/NotificationProvider';
import AddRemoveQuantityOfProducts from '../../../shared/ui/AddRemoveQuantityOfProducts/AddRemoveQuantityOfProducts';


const ProductMobileActionButtonCart: React.FC<ProductMobileActionButtonCartProps> = ({
  productId,
  isInCart,
  cartQuantity,
  cartItemId,
  isMobile,
  updateCartState,
}) => {
  const [isInCartProduct, setIsInCart] = useState(isInCart);
  const [cartQuantityProduct, setCartQuantity] = useState(cartQuantity);
  const { showNotification } = useNotification();

  useEffect(() => {
    setIsInCart(isInCart);
    setCartQuantity(cartQuantity);
  }, [isInCart, cartQuantity]);

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
    updateCartState?.(isInCartProduct, newQuantity, cartItemId);
  };

  const handleDecreaseQuantity = () => {
    const newQuantity = Math.max(cartQuantityProduct - 1, 1);
    setCartQuantity(newQuantity);
    updateCartState?.(isInCartProduct, newQuantity, cartItemId);
  };


  return (
    <div className={styles.overlay}>
      <div className={styles.detailsContainer}>
        {isInCartProduct ? (
          <div className={styles.AddRemoveQuantityOfProduct}>
            <AddRemoveQuantityOfProducts
              countOfProduct={cartQuantityProduct}
              cartItemId={cartItemId}
              isMobile={isMobile}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
            />
          </div>
        ) : (
          <div onClick={handleAddToCart}>
            <button className={styles.button}>
              Добавить в Корзину
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export default ProductMobileActionButtonCart;
