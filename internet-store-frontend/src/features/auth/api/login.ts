import axiosInstance from '../../../shared/api/axiosInstance';
import { LoginData } from '../../../interfaces';


export const loginUser = async (data: LoginData) => {
  try {
    const response = await axiosInstance.post('/account/login/', {
      username: data.username,
      password: data.password,
    }, {
      withCredentials: true,
    });

		localStorage.setItem('token', response.data.token);
		localStorage.setItem('username', response.data.profile.username);
		localStorage.setItem('fullname', response.data.profile.fullname);
		localStorage.setItem('phoneNumber', response.data.profile.phoneNumber);

    axiosInstance.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data.message, errorType: error.response.data.errorType };
    }
    console.error('Ошибка при входе в аккаунт:', error);
    throw error;
  }
};

