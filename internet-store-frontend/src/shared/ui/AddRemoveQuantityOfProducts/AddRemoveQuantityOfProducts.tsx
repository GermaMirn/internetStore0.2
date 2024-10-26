import React, { useState } from 'react';
import styles from './AddRemoveQuantityOfProducts.module.css';
import { addUnitToCartProduct } from '../../api/updateCartProductQuantity/addUnitToCartProduct';
import { removeUnitToCartProduct } from '../../api/updateCartProductQuantity/removeUnitToCartProduct';


interface AddRemoveQuantityOfProducts {
  countOfProduct: number;
  cartItemId: number;
}

const AddRemoveQuantityOfProducts: React.FC<AddRemoveQuantityOfProducts> = ({ countOfProduct = 1, cartItemId }) => {
  const [count, setCount] = useState(countOfProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    setLoading(true);
    setError(null);
    try {
      await addUnitToCartProduct(cartItemId);
      setCount((prevCount) => prevCount + 1);
    } catch (err) {
      setError('Ошибка при добавлении товара в корзину.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (count > 1) {
      setLoading(true);
      setError(null);
      try {
        await removeUnitToCartProduct(cartItemId);
        setCount((prevCount) => prevCount - 1);
      } catch (err) {
        setError('Ошибка при удалении товара из корзины.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.divOfaddRemoveQuantityOfProducts}>
      {error && <div className={styles.error}>{error}</div>}
      <button className={styles.countButton} onClick={handleRemove} disabled={loading}>
        <img className={styles.icon} src={'/product/minus.svg'} alt="Minus" />
      </button>

      <h2 className={styles.count}>{count}</h2>

      <button className={styles.countButton} onClick={handleAdd} disabled={loading}>
        <img className={styles.icon} src={'/product/plus.svg'} alt="Plus" />
      </button>
    </div>
  );
};

export default AddRemoveQuantityOfProducts;
