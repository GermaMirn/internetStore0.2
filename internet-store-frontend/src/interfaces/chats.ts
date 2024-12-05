import { Profile } from ".";
import { Order } from ".";


export interface Chat {
  id: number;
  participants: Profile[];
  created_at: string;
  messages: Message[];
	order: Order;
}


export interface Message {
  id: number;
  chat: number;
  sender: Profile;
  text: string | null;
  image: string | null;
  created_at: string;
  is_read: boolean;
}


export interface ChatListProps {
  onSelectChat: (chatId: number) => void;
	onSelectChatOrder: (order: Order) => void;
  selectedChatId?: number | null;
  orderId?: number | null;
}


export interface ChatMessagesProps {
  chatId: number;
}


export interface ChatMessagesOrderProps {
  order: Order;
}
