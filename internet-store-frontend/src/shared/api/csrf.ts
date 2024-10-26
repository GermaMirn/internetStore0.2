import axiosInstance from './axiosInstance';
import Cookies from 'js-cookie';

export const fetchCsrfToken = async () => {
  try {
    const response = await axiosInstance.get('/get-csrf-token/');
    const csrfToken = response.data.csrfToken;

    axiosInstance.defaults.headers.common['X-CSRFToken'] = csrfToken;

    Cookies.set('csrftoken', csrfToken, { expires: 7, path: '/' });

    return csrfToken;
  } catch (error) {
    console.error('Ошибка при получении CSRF-токена:', error);
    throw error;
  }
};
