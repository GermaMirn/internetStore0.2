import styles from './FooterMobile.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FooterMobileProps } from '../../../../interfaces';


const FooterMobile: React.FC<FooterMobileProps> = ({ username }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const profileUrls = ['/login', '/register', '/enter', '/favorits', '/shoppingCart', '/profile', '/chats'];

  return (
    <div className={styles.mobileContent}>
			<div className={styles.logs}>
				<div onClick={() => navigate('')}>
					<img
						className={styles.footerHomeSvg}
						src={location.pathname === '/' ? 'footer/homeActive.svg' : '/footer/home.svg'}
						alt="home page"
					/>
				</div>

				<div onClick={() => navigate('/catalog')}>
					<img
						src={['/catalog', '/categories'].includes(location.pathname) ? 'footer/catalogActive.svg' : '/footer/catalog.svg'}
						alt="catalog page"
					/>
				</div>

				<div onClick={() => navigate('/orders')}>
					<img
						src={location.pathname === '/orders' ? 'footer/ordersActive.svg' : '/footer/orders.svg'}
						alt="orders page"
					/>
				</div>

				{username ? (
					<div onClick={() => navigate('/profile')}>
						<img
							src={profileUrls.some((url) => location.pathname.includes(url)) ? '/footer/profileActive.svg' : 'footer/profile.svg'}
							alt="profile icon"
						/>
					</div>
				) : (
					<div onClick={() => navigate('/enter')}>
						<img
							src={profileUrls.some((url) => location.pathname.includes(url)) ? '/footer/profileActive.svg' : 'footer/profile.svg'}
							alt="profile icon"
						/>
					</div>
				)}
			</div>
    </div>
  );
};


export default FooterMobile;
