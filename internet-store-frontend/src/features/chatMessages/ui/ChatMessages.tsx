import { useState, useEffect, useRef } from "react";
import { getChatMessages } from "../../../pages/chat/api/getChatMessages";
import { Message } from "../../../interfaces";
import { formatTimeToHoursMinutes } from "../utils/formatTimeToHoursMinutes";
import { useWebSocket } from "../../../hooks/useWebSocket";
import styles from "./ChatMessages.module.css";
import { ChatMessagesProps } from "../../../interfaces";
import { useErrorRedirect } from "../../../hooks/errorHandler";
import { convertToBase64 } from "../utils/converToBase64";
import { baseURL } from "../../../shared/api/axiosInstance";


const ChatMessages: React.FC<ChatMessagesProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef(messages);
  const currentUser = localStorage.getItem("username") || "currentUser";
  const handleError = useErrorRedirect();

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
        try {
          const messages = await getChatMessages(Number(chatId));
          setMessages(messages);
        } catch (error) {
          handleError(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMessages();
  }, [chatId]);

  const { sendMessage } = useWebSocket(chatId, messages, setMessages);

  const sendMessageHandler = async () => {
		if (newMessage.trim() || selectedImages.length > 0) {
			let imageBase64: string | null = null;

			if (selectedImages.length > 0) {
				imageBase64 = await convertToBase64(selectedImages[0]);
			}

			const messageData = {
				text: newMessage,
				image: imageBase64,
			};

			sendMessage(messageData);
			setNewMessage("");
			setSelectedImages([]);
		}
	};

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className={styles.chatMessagesContainer}>
      <div className={styles.messagesWrapper}>
        {messages.map((message, index) => {
          const isCurrentUser = message.sender.username === currentUser;
          return (
            <div key={`${message.id}-${index}`} className={`${styles.messageItem} ${isCurrentUser ? styles.myMessage : styles.otherMessage}`}>
              <div className={isCurrentUser ? styles.messageRight : styles.messageLeft}>
                <div className={styles.messageTextWrapper}>
                  <p className={styles.messageText}>
                    {message.text} <br />
                    {message.image && <img src={baseURL + message.image} alt="sent-image" className={styles.messageImage} />}
                    <div className={styles.timeAndReadData}>
                      <span className={`${styles.messageTime} ${isCurrentUser ? styles.messageTimeRight : ""}`}>
                        {formatTimeToHoursMinutes(message.created_at)}
                      </span>
                      <img
                        src={message.is_read ? "/chat/brandOfReading.svg" : "/chat/brandOfReading.svg"}
                        alt={message.is_read ? "Read" : "Not read"}
                        className={styles.readStatusIcon}
                      />
                    </div>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <div className={styles.messageInput}>
        <label htmlFor="file-upload">
          <img className={styles.addPhoto} src="/chat/addFile.svg" alt="" />
          <input id="file-upload" type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
        </label>
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Введите сообщение" />
        <img onClick={sendMessageHandler} src="/chat/send.svg" alt="" />
      </div>
    </div>
  );
};

export default ChatMessages;
