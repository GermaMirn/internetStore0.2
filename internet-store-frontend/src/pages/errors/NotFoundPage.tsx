import React from 'react';
import { useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.css'
import SearchProductsPage from '../searchProducts/ui/SearchProductsPage';


const NotFoundPage: React.FC = () => {
	const navigate = useNavigate()

  return (
		<div>
			<div className={styles.mainDivNotFoundPage}>
				<h1>Страница не найдена</h1>
				<p className={styles.errorText}>
					К сожалению, страница, которую вы ищете, не существует
					<span
						className={styles.returnToHomepage}
						onClick={() => navigate('/')}
					>
						. Вернуться на главную страницу
					</span>
				</p>
			</div>

			<SearchProductsPage />
		</div>
  );
};

export default NotFoundPage;
