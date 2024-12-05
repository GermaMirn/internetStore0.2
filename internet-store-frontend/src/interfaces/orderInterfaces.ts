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
  baseUrl: string;
}


export interface OrderDetailProps {
  order: Order;
  baseUrl: string;
  onClose: () => void;
}


export interface OrderDetailItemsProps {
  items: Order['items'];
  baseUrl: string;
}


export interface OrderStatusProps {
	status: string;
}
