import { useEffect, useState } from "react";
import { getUserChats } from "../api/getChats";
import { Chat } from "../../../interfaces";
import styles from "./ChatList.module.css";

const ChatList = () => {
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
      <h2>Your Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className={styles.chatItem}>
            <h3>Chat {chat.id}</h3>
            <p>Created at: {chat.created_at}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
