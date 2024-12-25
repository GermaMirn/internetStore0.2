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

  const isChatSelected = selectedChatId !== null;
  const isOrderAvailable = !!order;
  return (
		<>
			{!order && (
				<div className={styles.noOrderMessage}>
					<h2>Нет данных о заказе</h2>
				</div>
			)}

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
					{isOrderAvailable && <ChatMessagesHeader order={order} />}

					{isOrderAvailable && !isChatSelected && (
						<div className={styles.selectChatMessage}>
							<h2>Выберите чат</h2>
						</div>
					)}

					{isChatSelected ? (
						<ChatMessages chatId={selectedChatId} />
					) : (
						<></>
					)}
				</div>

				<div className={styles.orderInfo}>
					{isOrderAvailable ? (
						<ChatOrderInfo order={order} />
					) : (
						<div className={styles.noOrderMessage}>
							<></>
						</div>
					)}
				</div>
			</div>
		</>
  );
};


export default ChatPage;
