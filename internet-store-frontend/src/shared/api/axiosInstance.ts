let apiBaseURL;
let apiWebsocketURL;

console.log(window.location.hostname)
if (window.location.hostname === 'localhost') {
  apiBaseURL = 'http://localhost:8000'; // Для разработки
  apiWebsocketURL = 'localhost:8000';
} else if (window.location.hostname === 'clear-precious-turkey.ngrok-free.app') {
  apiBaseURL = 'https://clear-precious-turkey.ngrok-free.app'; // Для ngrok
} else {
  apiBaseURL = 'https://your-production-domain.com'; // Для продакшена
}


export const baseApiURL = `${apiBaseURL}/api`;
export const baseURL = apiBaseURL;
export const baseURLWebSocket = apiWebsocketURL;


import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: baseApiURL,
  withCredentials: true,
});


const token = localStorage.getItem('token');
if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Token ${token}`;
}


export default axiosInstance;
