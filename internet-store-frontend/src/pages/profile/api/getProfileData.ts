import axiosInstance from '../../../shared/api/axiosInstance';


export interface Profile {
	username: string;
	fullname: string;
	phoneNumber: string;
}


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
