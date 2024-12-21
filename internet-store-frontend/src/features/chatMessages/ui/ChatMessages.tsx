import { useState, useEffect, useRef } from "react";
import { getChatMessages } from "../../../pages/chat/api/getChatMessages";
import { Message } from "../../../interfaces";
import { formatTimeToHoursMinutes } from "../utils/formatTimeToHoursMinutes";
import styles from "./ChatMessages.module.css";
import { ChatMessagesProps } from "../../../interfaces";
import { useErrorRedirect } from "../../../hooks/errorHandler";


const ChatMessages: React.FC<ChatMessagesProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const ws = useRef<WebSocket | null>(null);
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

  const getToken = async () => {
    try {
      const token = localStorage.getItem("token");
      return token;
    } catch (error) {
      handleError(error);
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
            console.log("Соединение WebSocket установлено.");
          };

          ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.message) {
              setMessages((prevMessages) => {
                if (prevMessages.find((msg) => msg.id === data.message.id)) return prevMessages;
                return [...prevMessages, data.message];
              });
              console.log("messages: ", messagesRef.current);
            }

            if (data.status === "read") {
              setMessages((prevMessages) => {
                return prevMessages.map((msg) =>
                  msg.id === data.message.id ? { ...msg, is_read: true } : msg
                );
              });
              console.log("messages read: ", messagesRef.current);
            }
          };

          ws.current.onclose = () => {
            console.log("Соединение WebSocket закрыто.");
          };

          ws.current.onerror = (error) => {
            console.error("Ошибка WebSocket:", error);
          };
        } catch (error) {
          handleError(error);
        }
      }
    };

    establishWebSocketConnection();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() || selectedImages.length > 0) {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const formData = new FormData();
        formData.append("text", newMessage);

        // Добавляем изображения, если они есть
        selectedImages.forEach((image) => {
          formData.append("image", image);
        });

        const messageData = {
          text: newMessage,
          image: selectedImages.length > 0 ? selectedImages[0] : null,
        };

        // Отправляем через WebSocket
        ws.current.send(JSON.stringify(messageData));
        setNewMessage("");
        setSelectedImages([]); // Очищаем выбранные изображения
      } else {
        console.error("WebSocket не открыт.");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files)); // Сохраняем выбранные файлы
    }
  };

  const markAsRead = (messageId: number) => {
    const message = messagesRef.current.find((msg) => msg.id === messageId);
    if (!message || message.is_read || message.sender.username === currentUser) {
      return;
    }

    if (ws.current) {
      const commandData = {
        type: "mark_as_read",
        message_id: messageId,
      };
      ws.current.send(JSON.stringify(commandData));
    }
  };

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = parseInt(entry.target.getAttribute("data-id")!);
            markAsRead(messageId);
          }
        });
      },
      { threshold: 0.5 }
    )
  );

  useEffect(() => {
    const messageElements = document.querySelectorAll("[data-id]");
    messageElements.forEach((messageElement) => {
      observer.current.observe(messageElement);
    });

    return () => {
      messageElements.forEach((messageElement) => {
        observer.current.unobserve(messageElement);
      });
    };
  }, [messages]);

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
              data-id={message.id}
            >
              <div className={isCurrentUser ? styles.messageRight : styles.messageLeft}>
                <div className={styles.messageTextWrapper}>
                  <p className={styles.messageText}>
                    {message.text} <br />
                    {message.image && (
                      <img src={message.image} alt="sent-image" className={styles.messageImage} />
                    )}
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
          <img src="/chat/addFile.svg" alt="" />
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </label>
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
