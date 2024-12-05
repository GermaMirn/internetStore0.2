import React from 'react';
import styles from './OrderDetailItems.module.css';
import ProductImage from '../../../entities/order/ui/ProductImage';
import { OrderDetailItemsProps } from '../../../interfaces';


const OrderDetailItems: React.FC<OrderDetailItemsProps> = ({ items, baseUrl }) => {
  return (
    <>
      <h3>Товары в заказе:</h3>
      <div className={styles.orderItems}>
        {items.map((item, index) => (
          <div className={styles.orderItem} key={index}>
            <ProductImage
              key={index}
              productId={item.product.id}
              imageUrl={baseUrl + item.product.mainImageUrl}
            />
            <div className={styles.itemData}>
              <p>{item.product.name}</p>
              <p>{item.quantity} шт.</p>
              <h4>{Number(item.product.price) * item.quantity} ₽</h4>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};


export default OrderDetailItems;
