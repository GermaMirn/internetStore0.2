import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../api/getOrders';
import { Order } from '../../../interfaces';
import styles from './OrdersPage.module.css';
import OrderCard from '../../../entities/order/ui/OrderCard';


const UserOrders: React.FC = () => {
	const baseUrl = 'http://127.0.0.1:8000'
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedOrders = await getUserOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        setError('Не удалось загрузить заказы. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Загрузка заказов...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div>
      {orders.length === 0 ? (
        <h2 className={styles.emptyShoppingCart}>У вас пока нет заказов.</h2>
      ) : (
        <div>
					<h2>Ваши Заказы</h2>
					{orders.map((order) => (
						<OrderCard key={order.id} order={order} baseUrl={baseUrl} />
					))}
        </div>
      )}
    </div>
  );
};


export default UserOrders;
