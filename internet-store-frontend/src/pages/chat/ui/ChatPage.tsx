import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from 'react-router-dom';
import styles from "./ChatPage.module.css";
import ChatList from "../../../features/chatList/ui/ChatList";
import ChatMessages from "../../../features/chatMessages/ui/ChatMessages";
import { Order } from "../../../interfaces";
import ChatMessagesHeader from "../../../features/chatMessagesHeader/ui/ChatMessagesHeader";
import ChatOrderInfo from "../../../features/chatOrderInfo/ui/ChatOrderInfo";


const ChatPage = () => {
  const location = useLocation();
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
	const [searchParams, setSearchParams] = useSearchParams(new URLSearchParams(location.search));

  useEffect(() => {
    const orderId = searchParams.get('orderId');

    if (orderId) {
      setOrderId(Number(orderId));
    }
  }, [location]);

	const handleSelectChatOrder = (order: Order) => {
		setOrder(order);
		if (order) {
			setSearchParams({ orderId: order.id.toString() });
		}
	};

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatList}>
        <ChatList
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          onSelectChatOrder={handleSelectChatOrder}
          orderId={orderId}
        />
      </div>
      <div className={styles.chatMessages}>
        {order ? (
					<ChatMessagesHeader order={order} />
        ) : (
          <div>Нет данных о заказе</div>
        )}

        {selectedChatId ? <ChatMessages chatId={selectedChatId} /> : <div>Чат не выбран</div>}
      </div>

			<div className={styles.orderInfo}>
				{order ? (
					<ChatOrderInfo order={order} />
        ) : (
          <div>Нет данных о заказе</div>
        )}
			</div>
    </div>
  );
};


export default ChatPage;
