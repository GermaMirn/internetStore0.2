import { useState, useEffect, useRef } from "react";
import { getChatMessages } from "../../../pages/chat/api/getChatMessages";
import { Message } from "../../../interfaces";
import { formatTimeToHoursMinutes } from "../utils/formatTimeToHoursMinutes";
import styles from "./ChatMessages.module.css";


interface ChatMessagesProps {
  chatId: number;
}


const ChatMessages: React.FC<ChatMessagesProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const ws = useRef<WebSocket | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const currentUser = localStorage.getItem('username') || "currentUser";

  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
        try {
          const messages = await getChatMessages(Number(chatId));
          setMessages(messages);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMessages();
  }, [chatId]);

  const getToken = async () => {
    try {
      const token = localStorage.getItem('token');
      return token;
    } catch (error) {
      console.error("Failed to get token:", error);
      throw new Error("Token retrieval failed");
    }
  };

  useEffect(() => {
    const establishWebSocketConnection = async () => {
      if (chatId) {
        try {
          const token = await getToken();
          const wsUrl = `ws://127.0.0.1:8000/ws/chat/${chatId}/?token=${token}`;

          ws.current = new WebSocket(wsUrl);

          ws.current.onopen = () => {
            console.log("WebSocket connection established.");
          };

          ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.message) {
              setMessages((prevMessages) => {
                if (prevMessages.find(msg => msg.id === data.message.id)) return prevMessages;
                return [...prevMessages, data.message];
              });
            }
          };

          ws.current.onclose = () => {
            console.log("WebSocket connection closed.");
          };
        } catch (error) {
          console.error("WebSocket connection error:", error);
        }
      }
    };

    establishWebSocketConnection();

    return () => {
      ws.current?.close();
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() && ws.current) {
      const messageData = {
        text: newMessage,
        image: null,
      };

      ws.current.send(JSON.stringify(messageData));

      setNewMessage("");
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
						<div
							key={`${message.id}-${index}`}
							className={`${styles.messageItem} ${isCurrentUser ? styles.myMessage : styles.otherMessage}`}
						>
							<div className={isCurrentUser ? styles.messageRight : styles.messageLeft}>
								<div className={styles.messageTextWrapper}>
									<p className={styles.messageText}>
										{message.text} <br />
										<span className={styles.messageTime}>
											{formatTimeToHoursMinutes(message.created_at)}
										</span>
									</p>
								</div>
								<div
									className={isCurrentUser ? styles.arrowRight : styles.arrowLeft}
								/>
							</div>
						</div>
					);
				})}
				<div ref={messageEndRef} />
			</div>

			<div className={styles.messageInput}>
				<img src="/chat/addFile.svg" alt="" />
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Введите сообщение"
				/>
				<img onClick={sendMessage} src="/chat/send.svg" alt="" />
			</div>
		</div>
	);
};


export default ChatMessages;
