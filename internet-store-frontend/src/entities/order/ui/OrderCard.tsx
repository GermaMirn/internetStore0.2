import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../../interfaces';
import styles from './OrderCard.module.css';


interface OrderCardProps {
  order: Order;
  baseUrl: string;
}


const OrderCard: React.FC<OrderCardProps> = ({ order, baseUrl }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderCardHeader}>
        <h3>Заказ от {new Date(order.created_at).toLocaleDateString()}</h3>
        <h3>
          <span className={styles.sumText}>Сумма заказа:</span> <span>{order.totalPrice} ₽</span>
        </h3>
      </div>
      <div className={styles.orderCardDetails}>
        <p>#{order.id}</p>
        <p>Статус доставки: {order.isDelivered ? 'Доставлен' : 'В пути'}</p>
      </div>

      {order.items.length > 0 && (
        <div>
          <h3>Товары в заказе:</h3>
          <div className={styles.orderCardImages}>
            {order.items.map((item, index) => (
              <div key={index} className={styles.productImageContainer}>
                <img
                  className={styles.productImg}
                  src={baseUrl + item.product.mainImageUrl}
                  alt="img"
                  onClick={() => navigate(`/product/${item.product.id}`)}
                />
                <div className={styles.hoverText} onClick={() => navigate(`/product/${item.product.id}`)}>
                  <p className={styles.hoverTextP}>См. товар</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default OrderCard;
