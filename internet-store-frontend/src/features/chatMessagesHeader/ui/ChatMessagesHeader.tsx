import styles from "./ChatMessagesHeader.module.css";
import { dateFormattingForChats } from "../../chatList/utils/dateFormattingForChats";
import { Order } from "../../../interfaces";


interface ChatListProps {
  order: Order;
}


const ChatMessagesHeader: React.FC<ChatListProps> = ({ order }) => {


  return (
    <div className={styles.chatMessagesHeader}>
			<h2 className={styles.date}>{dateFormattingForChats(order.created_at ?? "")}</h2>
			<p className={styles.id}>#{order.id}</p>
		</div>
  );
};


export default ChatMessagesHeader;
