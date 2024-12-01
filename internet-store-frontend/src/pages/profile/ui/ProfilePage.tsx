import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/context/AuthContext';
import classNames from 'classnames';
import EditProfile from '../../../features/editProfile/ui/EditProfile';
import styles from './ProfilePage.module.css';


function ProfilePage() {
  const navigate = useNavigate();
  const { username, phoneNumber, fullname, logout } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  if (!username) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className={styles.mainDivProfile}>
      <h1>Личный Кабинет</h1>
      <div className={styles.profileCard}>
        <div className={styles.fioAndUsername}>
          <img className={styles.userLogo} src='/user/userLogo2.svg' alt='Профиль' />

          <div className={styles.namesInfo}>
            <h3>{fullname}</h3>
            <p>{username}</p>
          </div>
        </div>

        <div className={styles.phoneNumberAndActions}>
          <div className={styles.phoneNumberInfo}>
            <p>Телефон</p>
            <p>{phoneNumber}</p>
          </div>

          <div className={styles.authActions}>
            <div className={classNames(styles.authAction, styles.authEdit)} onClick={handleEditProfile}>
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

      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
					<EditProfile handleClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
}


export default ProfilePage;
