import React from 'react';
import styles from './FormForSendNewReview.module.css';
import FormForSendNewComment from '../Comment/FormForSendNewCommentReview';
import { FormForSendNewReviewProps } from '../../interfaces';


const FormForSendNewReview: React.FC<FormForSendNewReviewProps> = ({ productImg, productName, onClose, handleSubmitReview }) => {
	const baseUrl = 'http://127.0.0.1:8000'

  return (
		<div className={styles.mainDivForAddReviewForm}>
			<div className={styles.formAddReview}>

				<div className={styles.divForProduct}>
					<img className={styles.productImg} src={baseUrl + productImg} alt="img of product" />
					<h3 className={styles.productName}>{productName}</h3>
				</div>

				<h1>Ваш отзыв</h1>

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
