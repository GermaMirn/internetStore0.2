// import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductDetail.module.css'

const ProductDetail = () => {
	const { id } = useParams(); // Get the product ID from the URL
	// const [product, setProduct] = useState(null);

	// useEffect(() => {

	// }, [id]);

	// if (!product) return <div>Loading...</div>; // Loading state

	return (
		<div className={styles.divForProductDetail}>
			<p>{id}</p>
		</div>
	);
};

export default ProductDetail;
