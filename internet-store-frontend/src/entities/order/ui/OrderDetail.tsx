import React from 'react';
import { Order } from '../../../interfaces';
import { formatDate } from '../../../pages/infoAboutProductDetail/ui/ReviewsContainer/utils/dateUtils';
import styles from './OrderDetail.module.css';
import ProductImage from './ProductImage';


interface OrderDetailProps {
  order: Order;
  baseUrl: string;
  onClose: () => void;
}


const OrderDetail: React.FC<OrderDetailProps> = ({ order, baseUrl, onClose }) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };
	console.log(order)
  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.detailsContainer}>
        <h2>Заказа от {formatDate(order.created_at)}</h2>
				<p className={styles.orderId}>#{order.id}</p>
				<h3>Товары в заказе:</h3>
        <div className={styles.orderItems}>
          {order.items.map((item, index) => (
            <div className={styles.orderItem} key={index}>
              	<ProductImage
									key={index}
									productId={item.product.id}
									imageUrl={baseUrl + item.product.mainImageUrl}
								/>

							<div className={styles.itemData}>
								<p>{item.product.name}</p>
								<p>{item.quantity} шт.</p>
								<h4>{item.product.price} ₽</h4>
							</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default OrderDetail;
