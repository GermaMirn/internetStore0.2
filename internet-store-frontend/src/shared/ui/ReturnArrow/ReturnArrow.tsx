import { useNavigate } from 'react-router-dom';
import styles from './ReturnArrow.module.css';
import { ReturnArrowProps } from '../../../interfaces';


const ReturnArrow: React.FC<ReturnArrowProps> = ({ arrowSrc }) => {
  const navigate = useNavigate();

  return (
    <img
      className={styles.returnArrow}
      src={arrowSrc}
      alt='return arrow'
      onClick={() => navigate(-1)}
    />
  );
};

export default ReturnArrow;
