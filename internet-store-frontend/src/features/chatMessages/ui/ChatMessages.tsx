import { useState, useRef, useEffect } from "react";
import { useWebSocket } from "../../../hooks/useWebSocket";
import { convertToBase64 } from "../utils/converToBase64";
import { useMessages } from "../hooks/useMessages";
import { MessagesList } from "../../../entities/MessagesList/ui/MessagesList";
import styles from "./ChatMessages.module.css";
import { ChatMessagesProps } from "../../../interfaces";
import ImagePreviewModal from "../../../entities/imagePreviewModal/ImagePreviewModal";


const ChatMessages: React.FC<ChatMessagesProps> = ({ chatId }) => {
  const [messages, setMessages] = useMessages(String(chatId));
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const currentUser = localStorage.getItem("username") || "currentUser";
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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
      const files = Array.from(e.target.files);
      setSelectedImages(files);
      setShowPreviewModal(true);
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={styles.chatMessages}>
      <div className={styles.messagesWrapper}>
        <MessagesList messages={messages} currentUser={currentUser} />
        <div ref={messageEndRef} />
      </div>

      <div className={styles.messageInput}>
        <label htmlFor="file-upload">
          <img className={styles.addPhoto} src="/chat/addFile.svg" alt="" />
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
          className={styles.messageInputField}
          placeholder="Введите сообщение"
        />
        <img onClick={sendMessageHandler} src="/chat/send.svg" alt="" />
      </div>

      {showPreviewModal && (
        <ImagePreviewModal
          images={selectedImages}
          message={newMessage}
          onMessageChange={setNewMessage}
          onClose={() => {
            setShowPreviewModal(false);
            setSelectedImages([]);
          }}
          onSend={() => {
            sendMessageHandler();
            setShowPreviewModal(false);
          }}
        />
      )}
    </div>
  );
};


export default ChatMessages;
