import styles from "./ChatOrderInfo.module.css";
import { Order } from "../../../interfaces";
import OrderStatus from "../../../shared/ui/OrderStatus/OrderStatus";
import OrderDetailItems from "../../../shared/ui/OrderDetailItems/OrderDetailItems";


interface ChatOrderInfoProps {
  order: Order;
}


const ChatOrderInfo: React.FC<ChatOrderInfoProps> = ({ order }) => {

  return (
    <div className={styles.chatInfo}>
			<p>{<OrderStatus status={order.status} />}</p>


			<div className={styles.orderItems}>
				<OrderDetailItems items={order.items} baseUrl={"http://127.0.0.1:8000"} />
			</div>
		</div>
  );
};


export default ChatOrderInfo;
