import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getChatMessages } from "../api/getChatMessages";
import { addMessage } from "../api/addMessage"; // Импортируем функцию для добавления сообщения на сервер
import { Message } from "../../../interfaces";
import styles from "./ChatMessages.module.css";

const ChatMessages = () => {
  const { chatId } = useParams(); // Получаем chatId из URL параметров
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const ws = useRef<WebSocket | null>(null); // Ссылка на WebSocket
  const messageEndRef = useRef<HTMLDivElement | null>(null); // Для автоматической прокрутки в самый низ

  // Загружаем старые сообщения
  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
        try {
          const messages = await getChatMessages(Number(chatId)); // Преобразуем chatId в число
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

  // Устанавливаем WebSocket-соединение
  useEffect(() => {
    if (chatId) {
      ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}/`);

      ws.current.onopen = () => {
        console.log("WebSocket connection established.");
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.message) {
          // Если получили сообщение через WebSocket, добавляем его в чат
          setMessages((prevMessages) => [
            ...prevMessages,
            data.message
          ]);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      return () => {
        // Закрываем WebSocket соединение при размонтировании компонента
        ws.current?.close();
      };
    }
  }, [chatId]);

  // Отправка нового сообщения
  const sendMessage = async () => {
    if (newMessage.trim() && ws.current) {
      const messageData = {
        text: newMessage,
        image: null, // Вы можете добавить логику для отправки изображения
      };

      // Отправляем сообщение через WebSocket
      ws.current.send(JSON.stringify(messageData));

      // Сохраняем сообщение через API
      try {
        const savedMessage = await addMessage(Number(chatId), newMessage, null); // Отправка сообщения на сервер
        setMessages((prevMessages) => [...prevMessages, savedMessage]); // Добавляем сообщение в список
      } catch (error) {
        console.error("Failed to add message:", error);
      }

      // Очищаем поле ввода
      setNewMessage("");
    }
  };

  // Автоматическая прокрутка сообщений вниз
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
        {messages.map((message) => (
          <div key={message.id} className={styles.messageItem}>
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
