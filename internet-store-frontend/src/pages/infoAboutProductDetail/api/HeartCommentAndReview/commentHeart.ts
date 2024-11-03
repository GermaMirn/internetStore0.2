import axiosInstance from '../../../../shared/api/axiosInstance';


export const addHeartToComment = async (commentId: number) => {
  try {
    const response = await axiosInstance.post(`/store/comment/${commentId}/heart/`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении лайка к комментарию', error);
    throw error;
  }
};


export const removeHeartFromComment = async (commentId: number) => {
  try {
    const response = await axiosInstance.delete(`/store/comment/${commentId}/heart/`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении лайка из комментария', error);
    throw error;
  }
};
