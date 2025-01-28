import axiosInstance from "../../../shared/api/axiosInstance";
import { Order } from "../../../interfaces";


export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const response = await axiosInstance.get('orders/getUserOrders/');
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('Failed to fetch user orders');
  }
};
