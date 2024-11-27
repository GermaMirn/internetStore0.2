import { useEffect, useState } from "react";
import { getUserChats } from "../api/getChats";
import { Chat } from "../../../interfaces";
import styles from "./ChatList.module.css";
import { dateFormattingForChats } from "../utils/dateFormattingForChats";


interface ChatListProps {
  onSelectChat: (chatId: number) => void;
}


const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chats = await getUserChats();
        setChats(chats);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return <div>Loading chats...</div>;
  }

  return (
		<div className={styles.chatListContainer}>
        {chats.map((chat) => (
          <div key={chat.id} className={styles.chat} onClick={() => onSelectChat(chat.id)}>
						<div className={styles.header}>
							<h3>{dateFormattingForChats(chat.order.created_at)}</h3>
							<p>#{chat.order.id}</p>
						</div>
						<div>

						</div>
          </div>
        ))}
    </div>
  );
};


export default ChatList;
