import { useState, useEffect, useRef } from "react";
import { getChatMessages } from "../../../pages/chat/api/getChatMessages";
import { Message } from "../../../interfaces";
import { useErrorRedirect } from "../../../hooks/errorHandler";

export const useMessages = (chatId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const messagesRef = useRef(messages);
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

  return [messages, setMessages] as const;
};
