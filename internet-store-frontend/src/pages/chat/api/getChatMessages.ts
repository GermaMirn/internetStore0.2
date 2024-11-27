import axiosInstance from "../../../shared/api/axiosInstance";
import { Message } from "../../../interfaces";


export const getChatMessages = async (chatId: number): Promise<Message[]> => {
  try {
    const response = await axiosInstance.get(`orders/chat/${chatId}/messages/`);
		console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw new Error('Failed to fetch chat messages');
  }
};
