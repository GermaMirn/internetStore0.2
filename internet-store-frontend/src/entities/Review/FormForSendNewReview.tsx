import React from 'react';
import styles from './FormForSendNewReview.module.css';
import FormForSendNewComment from '../Comment/FormForSendNewCommentReview';
import { FormForSendNewReviewProps } from '../../interfaces';
import { baseURL } from '../../shared/api/axiosInstance';
import { useIsMobile } from '../../app/routes/hooks/useIsMobile';


const FormForSendNewReview: React.FC<FormForSendNewReviewProps> = ({ productImg, productName, onClose, handleSubmitReview }) => {
	const isMobile = useIsMobile();

  return (
		<div className={styles.mainDivForAddReviewForm}>
			<div className={styles.formAddReview}>

				<div className={styles.divForProduct}>
					<img className={styles.productImg} src={baseURL + productImg} alt="img of product" />
					<h3 className={styles.productName}>{productName}</h3>
				</div>

				{!isMobile && <h1>Ваш отзыв</h1>}

				<div className={styles.divForForm}>
					<FormForSendNewComment
						isReview={true}
						onClose={onClose}
						onSubmit={handleSubmitReview}
					/>
				</div>
			</div>
		</div>
	);
};


export default FormForSendNewReview;
