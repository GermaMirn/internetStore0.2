import styles from './TrashCan.module.css';
import { removeProductToCart } from '../api/removeAddProductToCart/removeProductToCart'
import { TrashCanProps } from '../../interfaces';

const TrashCan: React.FC<TrashCanProps> = ({ itemId }) => {

  const toggleLike = async () => {
    try {
			await removeProductToCart(itemId);

    } catch (error) {
      console.error('Ошибка при изменении статуса лайка', error);
    }
  };

  return (
    <div className={styles.trashCanContainer} onClick={toggleLike}>
			<img className={styles.trashCanIcon} src={'/product/trashCan.svg'} alt="trash can" />
		</div>
  );
};


export default TrashCan;
