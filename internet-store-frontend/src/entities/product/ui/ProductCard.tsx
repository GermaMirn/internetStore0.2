import React from 'react';
import styles from './ProductCard.module.css'

// Типизация данных о продукте
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
		<div className={styles.productCard}>
			<h3>{product.name}</h3>
			<p>{product.description}</p>
			<p>Price: ${product.price}</p>
		</div>
  );
};

export default ProductCard;
