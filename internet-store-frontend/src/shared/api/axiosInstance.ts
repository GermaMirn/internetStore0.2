import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});


export const baseURL = 'http://localhost:8000'


const token = localStorage.getItem('token');
if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Token ${token}`;
}


export default axiosInstance;
