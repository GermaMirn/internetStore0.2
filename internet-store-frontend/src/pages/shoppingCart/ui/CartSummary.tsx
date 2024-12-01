import styles from './CartSummary.module.css';
import Button from '../../../shared/ui/Button';
import createOrder from '../api/createOrder';
import { CartSummaryProps } from '../../../interfaces';
import { useNotification } from '../../../app/providers/notifications/NotificationProvider';


export const CartSummary: React.FC<CartSummaryProps> = ({ totalAmount, itemCount, selectedItems, onOrderSuccess }) => {
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
      console.error(error);
    }
  };


	return (
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
				<Button text={'Перейти к Оформлению'} color={'color'} />
			</div>
		</div>
	);
};
