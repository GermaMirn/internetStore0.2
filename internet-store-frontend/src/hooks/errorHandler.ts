import { useNavigate } from 'react-router-dom';


export const useErrorRedirect = () => {
	const navigate = useNavigate();

	const handleError = (error: any) => {
		if (error.response?.status === 500) {
			navigate('/500');
		} else {
			console.error('Произошла ошибка:', error);
		}
	};

	return handleError;
};
