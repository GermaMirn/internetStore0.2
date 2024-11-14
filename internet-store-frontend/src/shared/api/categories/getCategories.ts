import axiosInstance from '../axiosInstance';


export const getCategories = async () => {
  try {
    const response = await axiosInstance.get(`/store/categories/`);
    const answer = response.data;
		console.log(answer)
    return answer;
  } catch (error) {
    console.error('Ошибка при добавление лайка', error);
    throw error;
  }
};
