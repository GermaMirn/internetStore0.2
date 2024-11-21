import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getChatMessages } from "../api/getChatMessages";
import { Message } from "../../../interfaces";
import styles from "./ChatMessages.module.css";


const ChatMessages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const ws = useRef<WebSocket | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

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
      <h2>Messages for Chat {chatId}</h2>
      <div className={styles.messagesWrapper}>
				{messages.map((message, index) => (
					<div key={`${message.id}-${index}`} className={styles.messageItem}>
						<span className={styles.messageSender}>{message.sender.username}</span>
						<p className={styles.messageText}>{message.text}</p>
						<span className={styles.messageTime}>{message.created_at}</span>
					</div>
				))}
        <div ref={messageEndRef} />
      </div>

      <div className={styles.messageInput}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};


export default ChatMessages;
