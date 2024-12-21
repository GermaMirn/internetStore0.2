import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../api/getOrders';
import { Order } from '../../../interfaces';
import styles from './OrdersPage.module.css';
import OrderCard from '../../../entities/order/ui/OrderCard';
import { useErrorRedirect } from '../../../hooks/errorHandler';


const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
	const handleError = useErrorRedirect();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        const fetchedOrders = await getUserOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Загрузка заказов...</div>;
  }

  return (
    <div>
      {orders.length === 0 ? (
        <h2 className={styles.emptyShoppingCart}>У вас пока нет заказов.</h2>
      ) : (
        <div>
					<h2 className={styles.mainText}>Ваши Заказы</h2>
					{orders.map((order) => (
						<OrderCard key={order.id} order={order} />
					))}
        </div>
      )}
    </div>
  );
};


export default UserOrders;
