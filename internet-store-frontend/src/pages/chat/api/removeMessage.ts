import axiosInstance from "../../../shared/api/axiosInstance";


export const deleteMessage = async (messageId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`orders/message/${messageId}/delete/`);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw new Error('Failed to delete message');
  }
};
