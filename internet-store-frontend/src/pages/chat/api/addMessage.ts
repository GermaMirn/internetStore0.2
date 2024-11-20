import axiosInstance from "../../../shared/api/axiosInstance";
import { Message } from "../../../interfaces";


export const addMessage = async (chatId: number, text: string, image: string | null): Promise<Message> => {
  try {
    const response = await axiosInstance.post(`orders/chat/${chatId}/addMessage/`, { text, image });
    return response.data;
  } catch (error) {
    console.error('Error adding message:', error);
    throw new Error('Failed to add message');
  }
};
