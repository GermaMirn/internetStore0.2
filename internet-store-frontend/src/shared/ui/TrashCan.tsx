import styles from './TrashCan.module.css';
import { removeProductToCart } from '../api/removeAddProductToCart/removeProductToCart'
import { TrashCanProps } from '../../interfaces';
import { useNotification } from '../../app/providers/notifications/NotificationProvider';


const TrashCan: React.FC<TrashCanProps> = ({ itemId }) => {
	const { showNotification } = useNotification();

  const toggleLike = async () => {
    try {
			await removeProductToCart(itemId);

    } catch (error) {
      showNotification('Ошибка при удаление', 'error');
    }
  };

  return (
    <div className={styles.trashCanContainer} onClick={toggleLike}>
			<img className={styles.trashCanIcon} src={'/product/trashCan.svg'} alt="trash can" />
		</div>
  );
};


export default TrashCan;
