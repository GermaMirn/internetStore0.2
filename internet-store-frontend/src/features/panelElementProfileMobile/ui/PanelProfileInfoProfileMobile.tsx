import styles from './PanelProfileInfoProfileMobile.module.css';
import { PanelProfileInfoProfileMobileProps } from '../../../interfaces';
import { formatFIO } from '../utils/refactorFIO';


const PanelProfileInfoProfileMobile: React.FC<PanelProfileInfoProfileMobileProps> = ({ fio, username, phoneNumber, edit }) => {
	const refactorFio = fio ? formatFIO({ fio }) : '';

	return (
		<div className={styles.mainDiv}>
			<img className={styles.userLogo} src='/user/userLogo2.svg' alt='фотка пользователя' />

			<div className={styles.profileInfo}>
				<div>
					<h2>{refactorFio}</h2>
					<p>{username}</p>
				</div>

				<div className={styles.phoneInfo}>
					<h5>Телефон</h5>
					<p className={styles.phoneNumber}>{phoneNumber}</p>
				</div>
			</div>

			<div className={styles.changeProfileData} onClick={( () => edit())}>
				<img className={styles.imgChangeProfile} src="/user/change.svg" alt="" />
			</div>
		</div>
	);
}


export default PanelProfileInfoProfileMobile;
