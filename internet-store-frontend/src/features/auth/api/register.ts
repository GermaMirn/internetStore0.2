import axios from 'axios';


interface RegisterData {
  username: string;
  fio: string;
  phone: string;
  password: string;
  confirmPassword: string;
}


export const registerUser = async (data: RegisterData) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/account/accounts/createAccount/', {
      username: data.username,
      fullname: data.fio,
      phone: data.phone,
      password: data.password,
    }, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
		if (error.response) {
			console.log(error.response)
			return {success: false, message: error.response.data.message, errorType: error.response.data.errorType}
		}

    console.error('Ошибка при регистрации:', error);
    throw error;
  }
};
