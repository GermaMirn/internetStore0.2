import React from 'react';
import { OrderDetailProps } from '../../../interfaces';
import { formatDate } from '../../../pages/infoAboutProductDetail/ui/ReviewsContainer/utils/dateUtils';
import styles from './OrderDetail.module.css';
import OrderDetailItems from '../../../shared/ui/OrderDetailItems/OrderDetailItems';
import Cross from '../../../shared/ui/Cross/Cross';


const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose }) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

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
      </div>
    </div>
  );
};


export default OrderDetail;
