import axios from 'axios';


interface LoginData {
  username: string;
  password: string;
}


export const loginUser = async (data: LoginData) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/account/accounts/login/', {
      username: data.username,
      password: data.password,
    }, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data.message, errorType: error.response.data.errorType };
    }
    console.error('Ошибка при входе в аккаунт:', error);
    throw error;
  }
};

