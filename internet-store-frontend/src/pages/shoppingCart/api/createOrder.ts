import axiosInstance from '../../../shared/api/axiosInstance';


const createOrder = async (items:object, totalPrice: number) => {
  try {
    const response = await axiosInstance.post(`/store/createOrder/`, {
      items,
      totalPrice
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании заказа', error);
    throw error;
  }
};

export default createOrder;
