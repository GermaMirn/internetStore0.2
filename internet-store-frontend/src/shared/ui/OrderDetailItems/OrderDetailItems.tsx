import React from 'react';
import { Order } from '../../../interfaces';
import styles from './OrderDetailItems.module.css';
import ProductImage from '../../../entities/order/ui/ProductImage';


interface OrderDetailItemsProps {
  items: Order['items'];
  baseUrl: string;
}


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
              <h4>{item.product.price} ₽</h4>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};


export default OrderDetailItems;
