import { useEffect, useRef } from "react";
import { Message } from "../interfaces";
import { useErrorRedirect } from "../hooks/errorHandler";
import { baseURL } from "../shared/api/axiosInstance";


export const useWebSocket = (chatId: string | number, messages: Message[], setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
  const ws = useRef<WebSocket | null>(null);
  const messagesRef = useRef(messages);
  const handleError = useErrorRedirect();

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
          const wsUrl = `ws://${baseURL}:8000/ws/chat/${chatId}/?token=${token}`;

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
            }

            if (data.status === "read") {
              setMessages((prevMessages) => {
                return prevMessages.map((msg) =>
                  msg.id === data.message.id ? { ...msg, is_read: true } : msg
                );
              });
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

  const sendMessage = (messageData: { text: string; image: string | null }) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(messageData));
    } else {
      console.error("WebSocket не открыт.");
    }
  };

  return { ws, sendMessage };
};
