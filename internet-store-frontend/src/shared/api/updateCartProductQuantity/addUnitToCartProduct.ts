import axiosInstance from '../axiosInstance';


export const addUnitToCartProduct = async (itemId: number) => {
  try {
    const response = await axiosInstance.post(`/store/cart/item/update/${itemId}/`);
    const answer = response.data;

    return answer;
  } catch (error) {
    console.error('Ошибка при добавление лайка', error);
    throw error;
  }
};
