import axiosInstance from '../axiosInstance';


export const addHeart = async (productId: number) => {
  try {
    const response = await axiosInstance.post(`/store/heartProduct/${productId}/`);
    const answer = response.data;

    return answer;
  } catch (error) {
    console.error('Ошибка при добавление лайка', error);
    throw error;
  }
};
