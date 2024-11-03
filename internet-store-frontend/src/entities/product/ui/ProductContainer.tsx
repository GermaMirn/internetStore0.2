import React, { useState } from 'react';
import ProductCard from './ProductCard';
import QuickView from './QuickView';
import { Product } from './ProductCard';

interface ProductContainerProps {
  product: Product;
}

const ProductContainer: React.FC<ProductContainerProps> = ({ product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

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
        }}
        onQuickViewOpen={handleQuickViewOpen}
      />

      {isQuickViewOpen && (
        <QuickView
          product={{
            ...product,
          }}
          onClose={handleQuickViewClose}
        />
      )}
    </div>
  );
};

export default ProductContainer;
