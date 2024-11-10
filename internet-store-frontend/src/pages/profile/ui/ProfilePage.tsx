import styles from './ProfilePage.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../app/context/AuthContext';
import getProfileData from '../api/getProfileData';
import { Profile } from '../../../interfaces';
import classNames from 'classnames';


function ProfilePage() {
	const navigate = useNavigate();
	const { username, logout } = useAuth();
	const [profile, setProfile] = useState<Profile>();

	const handleLogout = () => {
    logout();
    navigate('/');
  };

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data: Profile = await getProfileData();
				setProfile(data);
			} catch (error) {
				console.error('Ошибка при загрузке данных профиля', error);
			}
		};

		fetchData();
	}, []);

	if (!profile) {
		return <p>Загрузка...</p>;
	}
	console.log(profile);
	return (
		<div className={styles.mainDivProfile}>
			<h1>Личный Кабинет</h1>
			<div className={styles.profileCard}>
				<div className={styles.fioAndUsername}>
					<img className={styles.userLogo} src='/user/userLogo2.svg' alt='Профиль' />

					<div className={styles.namesInfo}>
						<h3>{profile.fullname}</h3>
						<p>{username}</p>
					</div>
				</div>

				<div className={styles.phoneNumberAndActions}>
					<div className={styles.phoneNumberInfo}>
						<p>Телефон</p>
						<p>{profile.phoneNumber}</p>
					</div>

					<div className={styles.authActions}>
						<div className={styles.authAction}>
							<img className={styles.uathActionImg} src="/user/change.svg" alt="change" />
							<p>Изменить</p>
						</div>

						<div className={classNames(styles.authAction, styles.authExit)} onClick={handleLogout}>
							<img className={styles.uathActionImg} src="/user/exit.svg" alt="exit" />
							<p>Выйти</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


export default ProfilePage;
