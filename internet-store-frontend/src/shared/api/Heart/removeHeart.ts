import axiosInstance from '../axiosInstance';


export const removeHeart = async (productId: number) => {
  try {
    const response = await axiosInstance.delete(`/store/heartProduct/${productId}/`);
    const answer = response.data;

    return answer;
  } catch (error) {
    console.error('Ошибка при удаление лайка', error);
    throw error;
  }
};
