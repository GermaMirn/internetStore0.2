import axiosInstance from "../../../shared/api/axiosInstance";


export const markMessageAsRead = async (messageId: number): Promise<void> => {
  try {
    await axiosInstance.post(`orders/message/${messageId}/markAsRead/`);
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw new Error('Failed to mark message as read');
  }
};
