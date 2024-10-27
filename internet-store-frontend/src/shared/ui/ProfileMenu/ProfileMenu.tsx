import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileMenu.module.css';


interface ProfileMenuProps {
  onLogout: () => void;
  visible: boolean;
  toggleMenu: () => void;
}


const ProfileMenu: React.FC<ProfileMenuProps> = ({ onLogout, visible, toggleMenu }) => {
  const navigate = useNavigate();
	const username = localStorage.getItem('username');
	const fio = localStorage.getItem('fullname');
	const phoneNumber = localStorage.getItem('phoneNumber');


  if (!visible) return null;

  return (
    <div className={styles.dropdownMenu} onClick={toggleMenu}>
			<div className={styles.divForFio}>
				<h4>{fio}</h4>
			</div>
			<div className={styles.divForUsername}>
				<p>{username}</p>
			</div>
			<div className={styles.divForPhoneNumber}>
				<p>{phoneNumber}</p>
			</div>
			<hr className={styles.hr} />

      <div className={styles.menuItem} onClick={() => navigate('/profile')}>
        <p>Личный кабинет</p>
      </div>

			<div className={styles.menuItem} onClick={() => navigate('/favorits')}>
				<p>Избранные</p>
			</div>

			<div className={styles.menuItem} onClick={() => navigate('/shoppingCart')}>
				<p>Корзина</p>
			</div>

			<div className={styles.menuItem} onClick={() => navigate('/orders')}>
				<p>Заказы</p>
			</div>

			<hr className={styles.hr} />
      <div className={styles.menuItem} onClick={onLogout}>
        <p className={styles.logout}>Выйти</p>
      </div>
    </div>
  );
};

export default ProfileMenu;
