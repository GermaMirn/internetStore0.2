import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/context/AuthContext';
import EditProfile from '../../../features/editProfile/ui/EditProfile';
import PanelElementProfileMobile from '../../../features/panelElementProfileMobile/ui/PanelElementProfileMobile';
import CategoriesMenuMobilePage from '../../../features/panelElementProfileMobile/ui/PanelProfileInfoProfileMobile';
import styles from './ProfileMobilePage.module.css';


function ProfileMobilePage() {
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
    <div className={styles.mainDivProfileMobile}>

			<CategoriesMenuMobilePage fio={fullname} username={username} phoneNumber={phoneNumber} edit={handleEditProfile} />

			<div className={styles.actionsProfile}>
				<PanelElementProfileMobile text={'Каталог'} urlToSvg={'/user/catalog.svg'} navigateUrl={'/catalog'} />
				<PanelElementProfileMobile text={'Избранные'} urlToSvg={'/user/favoritesMobile.svg'} navigateUrl={'/favorits'} />
				<PanelElementProfileMobile text={'Корзина'} urlToSvg={'/user/shoppingCartMobile.svg'} navigateUrl={'/shoppingCart'} />
				<PanelElementProfileMobile text={'Заказы'} urlToSvg={'/user/orders.svg'} navigateUrl={'/orders'} />
				<PanelElementProfileMobile text={'Чаты'} urlToSvg={'/user/chatMobile.svg'} navigateUrl={'/chats'} />

				<PanelElementProfileMobile text={'Выйти'} urlToSvg={'/user/exit.svg'} move={handleLogout} />
			</div>

			{isEditModalOpen && (
        <div className={styles.modalOverlay}>
					<EditProfile handleClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
}


export default ProfileMobilePage;
