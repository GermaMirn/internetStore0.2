import { useEffect, useState } from 'react';
import { getLikedProducts } from '../api/getFavoritProducts';
import { Product } from '../../../interfaces';
import styles from './FavoritsPage.module.css';
import ProductContainer from '../../../entities/product/ui/ProductContainer';
import EmptyPageText from '../../../shared/ui/EmptyPageText/EmptyPageText';
import { useErrorRedirect } from '../../../hooks/errorHandler';


const LikedProductsPage = () => {
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
	const handleError = useErrorRedirect();

  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const products = await getLikedProducts(true);
        setLikedProducts(products);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProducts();
  }, []);

  const handleRemoveLike = (productId: number) => {
    setLikedProducts(prev => prev.filter(product => product.id !== productId));
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

	if (likedProducts.length === 0) {
		return <EmptyPageText text={'Нет лайкнутых товаров'} />
	}

  return (
		<div className={styles.mainDivFavoritsPage}>
			<>
				<h1 className={styles.mainTextFavoritsPage}>Избранные товары</h1>
				<div className={styles.divFavoritsProduts}>
					{likedProducts.map((product: Product) => (
						<div key={product.id} className={styles.productCard}>
							<ProductContainer
								product={product}
								onRemoveLike={handleRemoveLike}
							/>
						</div>
					))}
				</div>
			</>
		</div>
	);
};


export default LikedProductsPage;
