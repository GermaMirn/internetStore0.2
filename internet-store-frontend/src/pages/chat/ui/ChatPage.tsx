import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from 'react-router-dom';
import styles from "./ChatPage.module.css";
import ChatList from "../../../features/chatList/ui/ChatList";
import ChatMessages from "../../../features/chatMessages/ui/ChatMessages";
import { Order } from "../../../interfaces";
import ChatOrderInfo from "../../../features/chatOrderInfo/ui/ChatOrderInfo";
import EmptyPageText from "../../../shared/ui/EmptyPageText/EmptyPageText";


const ChatPage = () => {
  const location = useLocation();
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [searchParams, setSearchParams] = useSearchParams(new URLSearchParams(location.search));
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);

  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId) setOrderId(Number(orderId));
  }, [location]);

  const handleSelectChatOrder = (order: Order) => {
    setOrder(order);
    if (order) setSearchParams({ orderId: order.id.toString() });
  };

  const isChatSelected = selectedChatId !== null;
  const isOrderAvailable = !!order;

  return (
    <div className={styles.chatPage}>
      <div
        className={`${styles.chatList} ${isLeftMenuOpen ? styles.menuOpen : ''}`}
      >
        <ChatList
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          onSelectChatOrder={handleSelectChatOrder}
          orderId={orderId}
        />
      </div>

      <button
        className={styles.menuToggleButtonLeft}
        onClick={() => setIsLeftMenuOpen(!isLeftMenuOpen)}
      >
        {isLeftMenuOpen ? '✕' : '☰'}
      </button>

      <div className={styles.mainContent}>
        {!order ? (
          <div className={styles.divEmptyOrder}>
            <EmptyPageText text={'Выберите чат'} />
          </div>
        ) : (
          <div className={styles.orderInfoAndMessages}>
            <div className={styles.chatMessages}>
              {isChatSelected && <ChatMessages chatId={selectedChatId} />}
            </div>
          </div>
        )}
      </div>

      <div
        className={`${styles.orderInfo} ${isRightMenuOpen ? styles.menuOpen : ''}`}
      >
        {isOrderAvailable ? (
          <ChatOrderInfo order={order} />
        ) : (
          <div className={styles.noOrderMessage}></div>
        )}
      </div>

      <button
        className={styles.menuToggleButtonRight}
        onClick={() => setIsRightMenuOpen(!isRightMenuOpen)}
      >
        {isRightMenuOpen ? '✕' : '!'}
      </button>

      {(isLeftMenuOpen || isRightMenuOpen) && (
        <div
          className={styles.overlay}
          onClick={() => {
            setIsLeftMenuOpen(false);
            setIsRightMenuOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatPage;
