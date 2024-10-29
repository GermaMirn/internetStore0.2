import React, { useState } from 'react';
import ProductCard from './ProductCard';
import QuickView from './QuickView';
import { Product } from './ProductCard';
import { addProductToCart } from '../../../shared/api/removeAddProductToCart/addProductToCart';

interface ProductContainerProps {
  product: Product;
}

const ProductContainer: React.FC<ProductContainerProps> = ({ product }) => {
  const [cartQuantity, setCartQuantity] = useState(product.cartQuantity);
  const [isInCart, setIsInCart] = useState(product.isInCart);
  const [isHearted, setIsHearted] = useState(product.isHearted);
  const [itemId, setItemId] = useState(product.cartItemId);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

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

  const handleIncreaseQuantity = () => {
    setCartQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setCartQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleToggleHeart = async (newLikedState: boolean) => {
    setIsHearted(newLikedState); // Обновляем состояние
  };

  const handleQuickViewOpen = () => {
    setIsQuickViewOpen(true);
  };

  const handleQuickViewClose = () => {
    setIsQuickViewOpen(false);
  };

  return (
    <div>
      <ProductCard
        product={{
          ...product,
          cartQuantity,
          isInCart,
          isHearted,
          cartItemId: itemId,
        }}
        onAddToCart={handleAddToCart}
        onToggleHeart={async () => await handleToggleHeart(!product.isHearted)}
        onQuickViewOpen={handleQuickViewOpen}
        onIncreaseQuantity={handleIncreaseQuantity}
        onDecreaseQuantity={handleDecreaseQuantity}
      />

      {isQuickViewOpen && (
        <QuickView
          product={{
            ...product,
            cartQuantity,
            isInCart,
            isHearted,
            cartItemId: itemId,
          }}
          onAddToCart={handleAddToCart}
          onToggleHeart={async () => await handleToggleHeart(!product.isHearted)}
          onClose={handleQuickViewClose}
          onIncreaseQuantity={handleIncreaseQuantity}
          onDecreaseQuantity={handleDecreaseQuantity}
        />
      )}
    </div>
  );
};

export default ProductContainer;
