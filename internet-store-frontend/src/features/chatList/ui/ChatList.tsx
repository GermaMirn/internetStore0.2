import { useEffect, useState } from "react";
import { getUserChats } from "../api/getChats";
import { Chat } from "../../../interfaces";
import styles from "./ChatList.module.css";
import { dateFormattingForChats } from "../utils/dateFormattingForChats";
import { Order } from "../../../interfaces";


interface ChatListProps {
  onSelectChat: (chatId: number) => void;
	onSelectChatOrder: (order: Order) => void;
  selectedChatId?: number | null;
  orderId?: number | null;
}


const ChatList: React.FC<ChatListProps> = ({ onSelectChat, onSelectChatOrder, selectedChatId, orderId }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const effectiveOrderId = selectedChatId ? null : orderId;
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chats = await getUserChats();
				console.log(chats)
        setChats(chats);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      onSelectChat(selectedChatId);
    } else if (effectiveOrderId) {
      const chatToSelect = chats.find(chat => chat.order.id === effectiveOrderId);
      if (chatToSelect) {
        onSelectChat(chatToSelect.id);
				onSelectChatOrder(chatToSelect.order);
      }
    }
  }, [selectedChatId, effectiveOrderId, chats, onSelectChat]);

  if (loading) {
    return <div>Loading chats...</div>;
  }

  return (
    <div className={styles.chatListContainer}>
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`${styles.chat} ${
            effectiveOrderId === chat.order.id || selectedChatId === chat.id ? styles.active : ""
          }`}
					onClick={() => {
            onSelectChat(chat.id);
            onSelectChatOrder(chat.order);
          }}
        >
          <div className={styles.header}>
            <h3>{dateFormattingForChats(chat.order.created_at)}</h3>
            <p>#{chat.order.id}</p>
          </div>
        </div>
      ))}
    </div>
  );
};


export default ChatList;
