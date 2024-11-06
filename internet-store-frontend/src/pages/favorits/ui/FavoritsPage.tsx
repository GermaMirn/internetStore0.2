import { useEffect, useState } from 'react';
import { getLikedProducts } from '../api/getFavoritProducts';
import { Product } from '../api/getFavoritProducts';
import styles from './FavoritsPage.module.css';
import ProductContainer from '../../../entities/product/ui/ProductContainer';


const LikedProductsPage = () => {
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getLikedProducts(true)
      .then(products => {
        setLikedProducts(products);
      })
      .catch(error => {
        console.error('Ошибка при загрузке лайкнутых продуктов:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className={styles.mainDivFavoritsPage}>
      <h1 className={styles.mainTextFavoritsPage}>Избранные товары</h1>
      <div className={styles.divFavoritsProduts}>
        {likedProducts ? (
          likedProducts.map((product: Product) => (
            <div key={product.id} className={styles.productCard}>
              <ProductContainer product={product} />
            </div>
          ))
        ) : (
          <p>Вы еще не лайкнули ни одного товара.</p>
        )}
      </div>
    </div>
  );
};


export default LikedProductsPage;
