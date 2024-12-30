import styles from './FooterMobile.module.css';
import { useNavigate } from 'react-router-dom';
import { FooterMobileProps } from '../../../../interfaces';


const FooterMobile: React.FC<FooterMobileProps> = ({username}) => {
	const navigate = useNavigate();

  return (
    <div className={styles.mobileContent}>
			<div onClick={(() => navigate(''))}>
				<img className={styles.footerHomeSvg} src="footer/home.svg" alt="home page" />
			</div>

			<div onClick={(() => navigate('/catalog'))}>
				<img src="footer/catalog.svg" alt="catalog page" />
			</div>

			<div>
				<img src="footer/orders.svg" alt="orders page" />
			</div>

			{username ? (
				<div>
					<img src="footer/profile.svg" alt="profile icon" />
				</div>
			) : (
				<div onClick={(() => navigate('/enter'))}>
					<img src="footer/profile.svg" alt="profile icon" />
				</div>
			)}
    </div>
  );
};


export default FooterMobile;
