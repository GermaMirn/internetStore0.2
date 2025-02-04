import React from 'react';
import styles from './CartSummaryMobile.module.css';
import createOrder from '../../api/createOrder';
import { CartSummaryMobileProps } from '../../../../interfaces';
import { useNotification } from '../../../../app/providers/notifications/NotificationProvider';


export const CartSummaryMobile: React.FC<CartSummaryMobileProps> = ({
  totalAmount,
  itemCount,
  selectedItems,
  onOrderSuccess,
}) => {
  const { showNotification } = useNotification();

  const handleOrder = async () => {
    if (selectedItems.length < 1) {
      showNotification('Добавьте хотя бы один товар в корзину для оформления заказа.', 'error');
      return;
    }

    const itemsForOrder = selectedItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    try {
      const response = await createOrder(itemsForOrder, totalAmount);
      console.log('Ответ от сервера:', response.message);
      showNotification('Заказ успешно оформлен', 'success');
      onOrderSuccess(selectedItems);
    } catch (error) {
      showNotification('Ошибка при создании заказа. Пожалуйста, попробуйте снова.', 'error');
    }
  };

  return (
    <div className={styles.divForCartSummaryAndButton}>
      <div className={styles.divCartSummary}>
        <div className={styles.textOfCartSummary}>
          <p>Выбрано товаров</p>
          <h4 className={styles.itemCount}>{itemCount}</h4>
        </div>

        <div className={styles.textOfCartSummary}>
          <p>Итого:</p>
          <h3 className={styles.totalAmount}>{totalAmount} ₽</h3>
        </div>

        <div className={styles.divButton} onClick={handleOrder}>
          <button className={styles.button}>
						Перейти к оформелнию
					</button>
        </div>
      </div>
    </div>
  );
};
