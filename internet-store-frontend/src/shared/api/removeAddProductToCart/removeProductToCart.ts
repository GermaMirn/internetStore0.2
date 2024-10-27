import axiosInstance from '../axiosInstance';


export const removeProductToCart = async (productId: number) => {
  try {
    const response = await axiosInstance.delete(`/store/cart/item/${productId}/`);
    const answer = response.data;

    return answer;
  } catch (error) {
    console.error('Ошибка при добавление лайка', error);
    throw error;
  }
};
