import React from "react";
import { Message } from "../../../interfaces";
import styles from "./MessagesList.module.css";
import { formatTimeToHoursMinutes } from "../utils/formatTimeToHoursMinutes";
import { baseURL } from "../../../shared/api/axiosInstance";

export const MessagesList: React.FC<{ messages: Message[], currentUser: string }> = ({ messages, currentUser }) => {
  return (
    <>
      {messages.map((message, index) => {
        const isCurrentUser = message.sender.username === currentUser;
        return (
          <div
            key={`${message.id}-${index}`}
            className={`${styles.messageItem} ${isCurrentUser ? styles.myMessage : styles.otherMessage}`}
          >
            <div className={isCurrentUser ? styles.messageRight : styles.messageLeft}>
              <div className={styles.messageTextWrapper}>
                <div className={styles.messageText}>
                  {message.image && (
                    <>
                      <img
                        src={baseURL + message.image}
                        alt={"sent-image"}
                        className={styles.messageImage}
                      />
                      <br />
                    </>
                  )}
                  {message.text}
                  <div className={styles.timeAndReadData}>
                    <span
                      className={`${styles.messageTime} ${isCurrentUser ? styles.messageTimeRight : ""}`}
                    >
                      {formatTimeToHoursMinutes(message.created_at)}
                    </span>
                    <img
                      src={
                        message.is_read
                          ? "/chat/brandOfReading.svg"
                          : "/chat/brandOfReading.svg"
                      }
                      alt={message.is_read ? "Read" : "Not read"}
                      className={styles.readStatusIcon}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
