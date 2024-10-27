import axiosInstance from '../../../shared/api/axiosInstance';


const getShoppingCartItems = async () => {
  try {
    const response = await axiosInstance.get(`/store/getShoppingCartItems/`);
    const answer = response.data;

    return answer.cartItems;
  } catch (error) {
    console.error('Ошибка при добавление лайка', error);
    throw error;
  }
};


export default getShoppingCartItems;
