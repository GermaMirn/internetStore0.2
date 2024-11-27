import React, { useState } from 'react';
import { Order } from '../../../interfaces';
import styles from './OrderCard.module.css';
import classNames from 'classnames';
import OrderDetail from './OrderDetail';
import ProductImage from './ProductImage';


interface OrderCardProps {
  order: Order;
  baseUrl: string;
}


const OrderCard: React.FC<OrderCardProps> = ({ order, baseUrl }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showMoreImages, setShowMoreImages] = useState(false);

  const visibleImages = order.items.slice(0, 5);
  const hiddenImages = order.items.slice(5);

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderCardHeader}>
        <h3>Заказ от {new Date(order.created_at).toLocaleDateString()}</h3>
        <h3>
          <span className={styles.sumText}>Сумма заказа:</span> <span>{order.totalPrice} ₽</span>
        </h3>
      </div>
      <div className={styles.orderCardDetails}>
        <p className={styles.orderId}>#{order.id}</p>
        <p>Статус доставки: {order.isDelivered ? 'Доставлен' : 'В пути'}</p>
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
                  imageUrl={baseUrl + item.product.mainImageUrl}
                />
              ))}

              {showMoreImages && hiddenImages.length > 0 && (
                hiddenImages.map((item, index) => (
                  <ProductImage
                    key={index + visibleImages.length}
                    productId={item.product.id}
                    imageUrl={baseUrl + item.product.mainImageUrl}
                  />
                ))
              )}
            </div>

            <div className={styles.divForActions}>
              <button className={classNames(styles.orderButton, styles.orderButtonChat)}>
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

          {hiddenImages.length > 0 && (
            <div className={styles.moreImagesContainer}>
              <button
                className={styles.moreImagesButton}
                onClick={() => setShowMoreImages(!showMoreImages)}
              >
                {showMoreImages ? 'Скрыть' : 'См. ещё'}
              </button>
            </div>
          )}
        </div>
      )}

      {showDetails && (
        <OrderDetail
          order={order}
          baseUrl={baseUrl}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};


export default OrderCard;
