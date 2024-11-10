import axiosInstance from '../../../shared/api/axiosInstance';
import { Profile } from '../../../interfaces';


const getProfileData = async (): Promise<Profile> => {
	try {
		const response = await axiosInstance.get(`/account/getUserInfo/`);
		return response.data.profile;
	} catch (error) {
		console.error('Ошибка при получение данных пользователя', error);
		throw error;
	}
};


export default getProfileData;
