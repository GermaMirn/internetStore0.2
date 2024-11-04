import React, { useState } from 'react';
import ProductCard from './ProductCard';
import QuickView from './QuickView';
import { Product } from './ProductCard';

interface ProductContainerProps {
  product: Product;
}

const ProductContainer: React.FC<ProductContainerProps> = ({ product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [cartData, setCartData] = useState({
    isInCart: product.isInCart,
    cartQuantity: product.cartQuantity,
    cartItemId: product.cartItemId,
    isHearted: product.isHearted,
  });

  const handleQuickViewOpen = () => {
    setIsQuickViewOpen(true);
  };

  const handleQuickViewClose = () => {
    setIsQuickViewOpen(false);
  };

  const updateCartState = (isInCart: boolean, quantity: number, itemId: number) => {
    setCartData(prev => ({ ...prev, isInCart, cartQuantity: quantity, cartItemId: itemId }));
  };

  const updateHeartState = (isHearted: boolean) => {
    setCartData(prev => ({ ...prev, isHearted }));
  };

  return (
    <div>
      <ProductCard
        product={{ ...product, ...cartData }}
        onQuickViewOpen={handleQuickViewOpen}
        updateCartState={updateCartState}
        updateHeartState={updateHeartState}
      />

      {isQuickViewOpen && (
        <QuickView
          product={{ ...product, ...cartData }}
          onClose={handleQuickViewClose}
          updateCartState={updateCartState}
          updateHeartState={updateHeartState}
        />
      )}
    </div>
  );
};

export default ProductContainer;
