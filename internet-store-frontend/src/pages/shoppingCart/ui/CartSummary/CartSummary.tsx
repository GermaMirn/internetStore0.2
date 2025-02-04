import React, { useState, useEffect } from 'react';
import styles from './CartSummary.module.css';
import Button from '../../../../shared/ui/Button';
import createOrder from '../../api/createOrder';
import { CartSummaryProps } from '../../../../interfaces';
import { useNotification } from '../../../../app/providers/notifications/NotificationProvider';


export const CartSummary: React.FC<CartSummaryProps> = ({
  totalAmount,
  itemCount,
  selectedItems,
  allSelected,
  onOrderSuccess,
  handleToggleAllItems,
}) => {
  const { showNotification } = useNotification();

  const [buttonSize, setButtonSize] = useState<'medium' | 'small'>(
    window.innerWidth <= 1240 ? 'small' : 'medium'
  );

  useEffect(() => {
    const handleResize = () => {
      setButtonSize(window.innerWidth <= 1240 ? 'small' : 'medium');
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        <h2>Ваша Корзина</h2>
        <div className={styles.textOfCartSummary}>
          <p>Товары:</p>
          <h4 className={styles.itemCount}>{itemCount}</h4>
        </div>

        <div className={styles.textOfCartSummary}>
          <p>Итого:</p>
          <h3 className={styles.totalAmount}>{totalAmount} ₽</h3>
        </div>

        <div className={styles.button} onClick={handleOrder}>
          <Button
						text={'Перейти к Оформлению'}
						color={'color'}
						size={buttonSize}
					/>
        </div>
      </div>
      <div onClick={handleToggleAllItems} className={styles.buttonForItems}>
        <Button
          text={allSelected ? 'Отменить выделение' : 'Выбрать все товары'}
          color={'notColor'}
          size={buttonSize}
        />
      </div>
    </div>
  );
};
