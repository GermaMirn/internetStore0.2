import axiosInstance from '../../../shared/api/axiosInstance';
import { UpdateUserData } from '../../../interfaces';


export const updateUserInfo = async (data: UpdateUserData) => {
  try {
    const response = await axiosInstance.post(
      '/account/updateUserInfo/',
      {
        username: data.username,
        password: data.password,
        current_password: data.currentPassword,
        fullname: data.fullname,
        phoneNumber: data.phoneNumber,
      },
      {
        withCredentials: true,
      }
    );

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      localStorage.setItem('username', response.data.profile.username);
      localStorage.setItem('fullname', response.data.profile.fullname);
      localStorage.setItem('phoneNumber', response.data.profile.phoneNumber);
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data.message, errorType: error.response.data.errorType };
    }
    console.error('Ошибка при изменении данных:', error);
    throw error;
  }
};
