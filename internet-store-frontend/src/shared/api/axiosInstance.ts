let apiBaseURL;


console.log(window.location.hostname)
if (window.location.hostname === 'localhost') {
  apiBaseURL = 'http://localhost:8000'; // Для разработки
} else if (window.location.hostname === 'clear-precious-turkey.ngrok-free.app') {
  apiBaseURL = 'https://clear-precious-turkey.ngrok-free.app'; // Для ngrok
} else {
  apiBaseURL = 'https://your-production-domain.com'; // Для продакшена
}


export const baseApiURL = `${apiBaseURL}/api`;
export const baseURL = apiBaseURL


import axios from 'axios';

console.log(baseApiURL, apiBaseURL, 'a')
const axiosInstance = axios.create({
  baseURL: baseApiURL,
  withCredentials: true,
});


const token = localStorage.getItem('token');
if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Token ${token}`;
}


export default axiosInstance;
