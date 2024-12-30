import styles from './Footer.module.css';
import FooterMobile from '../../../entities/footerComponents/ui/FooterMobile/FooterMobile';
import { useAuth } from '../../context/AuthContext';


export function Footer() {
	const { username } = useAuth();

  return (
    <footer className={styles.footer}>

			<div className={styles.desctop}>
				{/* FooterDesctop */}
			</div>

			<div className={styles.mobile}>
				<FooterMobile username={username} />
			</div>
    </footer>
  );
};
