import axiosInstance from "../../../shared/api/axiosInstance";
import { Chat } from "../../../interfaces";


export const getUserChats = async (): Promise<Chat[]> => {
  try {
    const response = await axiosInstance.get('orders/getUserChats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching user chats:', error);
    throw new Error('Failed to fetch user chats');
  }
};
