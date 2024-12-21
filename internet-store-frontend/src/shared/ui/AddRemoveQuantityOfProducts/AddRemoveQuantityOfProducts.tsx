import React, { useState, useEffect } from 'react';
import styles from './AddRemoveQuantityOfProducts.module.css';
import { addUnitToCartProduct } from '../../api/updateCartProductQuantity/addUnitToCartProduct';
import { removeUnitToCartProduct } from '../../api/updateCartProductQuantity/removeUnitToCartProduct';
import { AddRemoveQuantityOfProductsProps } from '../../../interfaces';
import classNames from 'classnames';
import { useNotification } from '../../../app/providers/notifications/NotificationProvider';


const AddRemoveQuantityOfProducts: React.FC<AddRemoveQuantityOfProductsProps> = ({
  countOfProduct = 1,
  cartItemId,
  onIncrease,
  onDecrease,
}) => {
  const [count, setCount] = useState(countOfProduct);
  const [loading, setLoading] = useState(false);
	const { showNotification } = useNotification();

  useEffect(() => {
    setCount(countOfProduct);
  }, [countOfProduct]);

  const handleAdd = async () => {
    setLoading(true);

    try {
      await addUnitToCartProduct(cartItemId);
      setCount((prevCount) => {
        const newCount = prevCount + 1;
        return newCount;
      });
      if (onIncrease) onIncrease();
    } catch (err) {
      showNotification('Не получилось добавить к количеству', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (loading || count <= 1) return;
    setLoading(true);

    try {
      await removeUnitToCartProduct(cartItemId);
      setCount((prevCount) => {
        const newCount = prevCount - 1;
        return newCount;
      });
      if (onDecrease) onDecrease();
    } catch (err) {
      showNotification('Не получилось убавить от количества', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.divOfaddRemoveQuantityOfProducts}>
      <button className={styles.countButton} onClick={handleRemove} disabled={loading}>
        <img className={classNames(styles.icon, styles.minus)} src={'/product/minus.svg'} alt="Minus" />
      </button>

      <h2 className={styles.count}>{count}</h2>

      <button className={styles.countButton} onClick={handleAdd} disabled={loading}>
        <img className={styles.icon} src={'/product/plus.svg'} alt="Plus" />
      </button>
    </div>
  );
};


export default AddRemoveQuantityOfProducts;
