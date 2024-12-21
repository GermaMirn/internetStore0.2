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
  status: string;
  items: OrderItem[];
	chat: Chat;
}


export interface OrderCardProps {
  order: Order;
}


export interface OrderDetailProps {
  order: Order;
  onClose: () => void;
}


export interface OrderDetailItemsProps {
  items: Order['items'];
}


export interface OrderStatusProps {
	status: string;
}
