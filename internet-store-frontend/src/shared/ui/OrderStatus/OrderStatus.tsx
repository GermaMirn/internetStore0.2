import styles from './OrderStatus.module.css'


interface OrderStatusProps {
	status: string;
}


const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  let statusImage;

  switch (status) {
    case 'Собирается':
      statusImage = '/product/preparing.svg';
      break;
    case 'В пути':
      statusImage = '/product/inTransit.svg';
      break;
    case 'Готово к выдаче':
      statusImage = '/product/readyForPickup.svg';
      break;
    default:
      statusImage = null;
  }

  return (
    <div>
      {statusImage ? (
				<div className={styles.statusContainer}>
					<img className={styles.img} src={statusImage} alt={status} />
					<h2 className={styles.text}>{status}</h2>
				</div>
      ) : (
        <h2 className={styles.text}>{status}</h2>
      )}
    </div>
  );
};

export default OrderStatus;
