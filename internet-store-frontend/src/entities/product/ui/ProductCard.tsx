import React, { useState } from 'react';
import styles from './ProductCard.module.css';
import Button from '../../../shared/ui/Button';
import Heart from '../../../shared/ui/Heart/Heart';
import AddRemoveQuantityOfProducts from '../../../shared/ui/AddRemoveQuantityOfProducts/AddRemoveQuantityOfProducts';
import { addProductToCart } from '../../../shared/api/removeAddProductToCart/addProductToCart';

interface Product {
  id: number;
  mainImageUrl: string;
  name: string;
  price: string;
  isHearted: boolean;
  isInCart: boolean;
  cartQuantity: number;
	cartItemId: number;
}

interface ProductCardProps {
  product: Product;
}

const baseUrl = 'http://127.0.0.1:8000/';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
	const [itemId, setItemId] = useState(product.cartItemId)
  const [isInCart, setIsInCart] = useState(product.isInCart);
  const [cartQuantity, setCartQuantity] = useState(product.cartQuantity);

  const handleAddToCart = async () => {
    try {
      const answer = await addProductToCart(product.id);
			setItemId(answer.item.id);
      setIsInCart(true);
      setCartQuantity(1);
    } catch (error) {
      console.error('Ошибка при добавлении товара в корзину', error);
    }
  };

  return (
    <div className={styles.productCard}>
      <img
        className={styles.imgOfProduct}
        src={baseUrl + product.mainImageUrl}
        alt={product.name}
      />
      <p className={styles.nameOfProduct}>{product.name}</p>
      <h2>{product.price} ₽</h2>

      <div className={styles.divForButtonsAndHeart}>
        {isInCart ? (
          <AddRemoveQuantityOfProducts
            countOfProduct={cartQuantity}
						cartItemId={itemId}
          />
        ) : (
          <div onClick={handleAddToCart}>
            <Button icon={'/header/shoppingCart.svg'} color={'color'} />
          </div>
        )}

        <div className={styles.heart}>
          <Heart productId={product.id} isProductLiked={product.isHearted} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
