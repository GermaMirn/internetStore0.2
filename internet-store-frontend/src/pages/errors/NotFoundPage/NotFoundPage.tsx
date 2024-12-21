import React from 'react';
import { useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.css'
import SearchProductsPage from '../../searchProducts/ui/SearchProductsPage';
import { ErrorTitle, ErrorMessage } from '../../../entities/ErrorPage';


export const NotFoundPage: React.FC = () => {
	const navigate = useNavigate()

  return (
		<div>
			<div className={styles.notFoundPage}>
				<ErrorTitle title="Страница не найдена" status={"404"} />

				<ErrorMessage
					message="К сожалению, страница, которую вы ищете, не существует"
					navigateText={". Вернуться на главную страницу"}
					navigate={() => navigate('/')}
				/>
			</div>

			<SearchProductsPage />
		</div>
  );
};


export default NotFoundPage;
