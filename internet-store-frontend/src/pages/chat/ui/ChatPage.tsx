import styles from "./ChatPage.module.css";
import { useState } from "react";
import ChatList from "../../../features/chatList/ui/ChatList";
import ChatMessages from "../../../features/chatMessages/ui/ChatMessages";

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatList}>
        <ChatList onSelectChat={setSelectedChatId} />
      </div>
      <div className={styles.chatMessages}>
        {selectedChatId ? <ChatMessages chatId={selectedChatId} /> : <div>Чат не выбран</div>}
      </div>
    </div>
  );
};

export default ChatPage;
