import React, { useState } from 'react';
import styles from './OrderCard.module.css';
import classNames from 'classnames';
import OrderDetail from './OrderDetail';
import ProductImage from './ProductImage';
import OrderStatus from '../../../shared/ui/OrderStatus/OrderStatus';
import { useNavigate } from 'react-router-dom';
import { OrderCardProps } from '../../../interfaces';
import { baseURL } from '../../../shared/api/axiosInstance';


const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);
	const navigate = useNavigate();

  const visibleImages = order.items.slice(0, 5);
  const hiddenImages = order.items.slice(5);

	const handleChatClick = () => {
    navigate(`/chats?orderId=${order.id}`);
  };

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderCardHeader}>
				<div className={styles.nameAndStatus}>
					<h2>Заказ от {new Date(order.created_at).toLocaleDateString()}</h2>

					<div className={styles.status}>
						<OrderStatus status={order.status} />
					</div>
				</div>
        <h3>
          <span className={styles.sumText}>Сумма заказа:</span> <span>{order.totalPrice} ₽</span>
        </h3>
      </div>
      <div className={styles.orderCardDetails}>
        <p className={styles.orderId}>#{order.id}</p>
      </div>

      {order.items.length > 0 && (
        <div>
          <h3>Товары в заказе:</h3>
          <div className={styles.divForImgAndActions}>
            <div className={styles.orderCardImages}>
              {visibleImages.map((item, index) => (
                <ProductImage
                  key={index}
                  productId={item.product.id}
                  imageUrl={baseURL + item.product.mainImageUrl}
                />
              ))}

							{hiddenImages.length > 0 && (
								<div>
									<p
										className={styles.moreImagesButton}
										onClick={() => setShowDetails(true)}
									>
										См. ещё
									</p>
								</div>
							)}
            </div>

            <div className={styles.divForActions}>
              <button onClick={handleChatClick} className={classNames(styles.orderButton, styles.orderButtonChat)}>
                <img className={styles.orderChatImg} src="/product/orderChat.svg" alt="" />
              </button>
              <button
                className={classNames(styles.orderButton, styles.orderButtonMore)}
                onClick={() => setShowDetails(true)}
              >
                Подробнее
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetails && (
        <OrderDetail
          order={order}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};


export default OrderCard;
