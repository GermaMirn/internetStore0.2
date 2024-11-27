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
