import styles from "./ChatOrderInfo.module.css";
import OrderStatus from "../../../shared/ui/OrderStatus/OrderStatus";
import OrderDetailItems from "../../../shared/ui/OrderDetailItems/OrderDetailItems";
import { ChatMessagesOrderProps } from "../../../interfaces";
import ChatMessagesHeader from "../../chatMessagesHeader/ui/ChatMessagesHeader";


const ChatOrderInfo: React.FC<ChatMessagesOrderProps> = ({ order }) => {

  return (
    <div className={styles.chatInfo}>
			<ChatMessagesHeader order={order} />


			<OrderStatus status={order.status} />


			<div className={styles.orderItems}>
				<OrderDetailItems items={order.items} />
			</div>
		</div>
  );
};


export default ChatOrderInfo;
