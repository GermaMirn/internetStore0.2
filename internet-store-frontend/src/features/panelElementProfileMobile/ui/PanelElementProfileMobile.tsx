import styles from './PanelElementProfileMobile.module.css';
import { useNavigate } from 'react-router-dom';
import { PanelElementProfileMobileProps } from '../../../interfaces';


const PanelElementProfileMobile: React.FC<PanelElementProfileMobileProps> = ({ text, urlToSvg, navigateUrl, move }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		if (navigateUrl) {
			navigate(navigateUrl);
		} else if (move) {
			move();
		}
	};

	return (
		<div className={styles.mainDiv} onClick={handleClick}>
			<img className={styles.svg} src={urlToSvg} alt={text} />
			<span className={styles.text} style={{ color: text === 'Выйти' ? 'red' : 'initial' }}>{text}</span>
		</div>
	);
}


export default PanelElementProfileMobile;
