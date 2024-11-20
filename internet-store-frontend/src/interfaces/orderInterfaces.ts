import { Product, Chat } from ".";


export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: string;
}


export interface Order {
  id: number;
  userId: number;
  created_at: string;
  totalPrice: string;
  isDelivered: boolean;
  items: OrderItem[];
	chat: Chat;
}
