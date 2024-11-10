import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../api/getOrders';
import { Order } from '../../../interfaces';

const UserOrders: React.FC = () => {
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
    return <div>Загрузка заказов...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Мои заказы</h2>
      {orders.length === 0 ? (
        <p>У вас пока нет заказов.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <h3>Заказ #{order.id}</h3>
              <p>Дата создания: {new Date(order.created_at).toLocaleDateString()}</p>
              <p>Сумма заказа: {order.totalPrice} руб.</p>
              <p>Статус доставки: {order.isDelivered ? 'Доставлен' : 'В пути'}</p>
              {order.items.length > 0 && (
                <div>
                  <h4>Товары в заказе:</h4>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        <p>Товар: {item.product.name}</p>
                        <p>Количество: {item.quantity}</p>
                        <p>Цена: {item.price} руб.</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserOrders;
