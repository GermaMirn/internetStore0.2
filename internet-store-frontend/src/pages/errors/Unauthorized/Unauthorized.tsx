import React from 'react';
import { useNavigate } from 'react-router-dom'
import styles from './Unauthorized.module.css'
import { ErrorTitle, ErrorMessage } from '../../../entities/ErrorPage';


export const Unauthorized: React.FC = () => {
	const navigate = useNavigate()

  return (
		<div>
			<div className={styles.unauthorized}>
				<ErrorTitle title="Доступ запрещён" status={"401"} />

				<ErrorMessage
					message="К сожалению, страница, которую вы ищете, доступна только для зарегистрированных пользователей"
					navigateText={". Войти в аккаунт"}
					navigate={() => navigate('/enter')}
				/>
			</div>
		</div>
  );
};


export default Unauthorized;
