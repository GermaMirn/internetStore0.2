import axiosInstance from '../axiosInstance';


export const addProductToCart = async (productId: number) => {
  try {
    const response = await axiosInstance.post(`/store/cart/item/${productId}/`);
    const answer = response.data;

    return answer;
  } catch (error) {
    console.error('Ошибка при добавление лайка', error);
    throw error;
  }
};
