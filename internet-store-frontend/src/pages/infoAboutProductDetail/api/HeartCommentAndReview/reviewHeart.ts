import axiosInstance from '../../../../shared/api/axiosInstance';


export const addHeartToReview = async (reviewId: number) => {
  try {
    const response = await axiosInstance.post(`/store/review/${reviewId}/heart/`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении лайка к отзыву', error);
    throw error;
  }
};


export const removeHeartFromReview = async (reviewId: number) => {
  try {
    const response = await axiosInstance.delete(`/store/review/${reviewId}/heart/`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении лайка из отзыва', error);
    throw error;
  }
};
