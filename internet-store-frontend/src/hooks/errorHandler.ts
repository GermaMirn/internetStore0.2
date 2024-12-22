import { useNavigate } from 'react-router-dom';


export const useErrorRedirect = () => {
	const navigate = useNavigate();

	const handleError = (error: any) => {
		const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? error.message : String(error);

		console.log('a ', errorMessage);

		if (errorMessage.includes("Error") || errorMessage.includes("500") || errorMessage.includes("Failed")) {
			navigate('/500');
		} else if (errorMessage.includes("404")) {
			navigate('/404');
		} else {
			console.error('Произошла ошибка:', error);
		}
	};

	return handleError;
};
