import React from 'react';
import { OrderDetailProps } from '../../../interfaces';
import { formatDate } from '../../reviewCommentData/utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import styles from './OrderDetail.module.css';
import OrderDetailItems from '../../../shared/ui/OrderDetailItems/OrderDetailItems';
import Cross from '../../../shared/ui/Cross/Cross';


const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose }) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
		const targetElement = event.target as Element;

		if (!targetElement.closest(`.${styles.detailsContainer}`)) {
			onClose();
		}
	};
	const navigate = useNavigate();

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.detailsContainer}>
				<div className={styles.orderDetailHeader}>
					<h2>Заказа от {formatDate(order.created_at)}</h2>

					<div className={styles.cross} onClick={(() => onClose())}>
						<Cross size={'medium'} />
					</div>
				</div>
        <p className={styles.orderId}>#{order.id}</p>
        <OrderDetailItems items={order.items} />

				<div className={styles.totalPriceAndNavigateToChat}>
					<p>
						Сумма заказа:
						<span className={styles.totalPrice}> {order.totalPrice}₽</span>
					</p>

					<button onClick={(() => navigate(`/chats?orderId=${order.id}`))} className={styles.orderButton}>
						<img className={styles.orderChatImg} src="/product/orderChat.svg" alt="" />
					</button>
				</div>
      </div>
    </div>
  );
};


export default OrderDetail;
