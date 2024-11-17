import axiosInstance from '../../../shared/api/axiosInstance';


export const getCategories = async () => {
  try {
    const response = await axiosInstance.get(`/store/categories/`);
    const answer = response.data;

    return answer;
  } catch (error) {
    console.error('Ошибка при добавление лайка', error);
    throw error;
  }
};
