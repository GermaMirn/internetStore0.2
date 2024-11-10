import { useEffect, useState } from 'react';
import { getLikedProducts } from '../api/getFavoritProducts';
import { Product } from '../../../interfaces';
import styles from './FavoritsPage.module.css';
import ProductContainer from '../../../entities/product/ui/ProductContainer';


const LikedProductsPage = () => {
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const products = await getLikedProducts(true);
        setLikedProducts(products);
      } catch (error) {
        console.error('Ошибка при загрузке лайкнутых продуктов:', error);
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

  return (
		<div className={styles.mainDivFavoritsPage}>
			{likedProducts.length > 0 ? (
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
			) : (
				<h2 className={styles.emptyFavorites}>Вы еще не лайкнули ни одного товара.</h2>
			)}
		</div>
	);
};


export default LikedProductsPage;
