import React from 'react';
import { CartItemProps } from '../../interfaces';
import styles from './CartItem.module.css';
import AddRemoveQuantityOfProducts from '../../shared/ui/AddRemoveQuantityOfProducts/AddRemoveQuantityOfProducts';
import Heart from '../../shared/ui/Heart/Heart';
import TrashCan from '../../shared/ui/TrashCan';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../shared/api/axiosInstance';
import { refactorText } from './utils/refactorText';
import { useWindowSize } from '../../hooks/useWindowSize';


export const CartItem: React.FC<CartItemProps> = ({ item, productId, onToggle, onIncrease, onDecrease, onRemove }) => {
	const navigate = useNavigate();
	const { width } = useWindowSize();
	const shouldRefactorText = width <= 1500;

	return (
		<div>
			<div
				className={`${styles.divOfCartItems} ${item.isActive ? styles.active : ''}`}
				onClick={onToggle}
			>
				<img
					className={`${styles.imgOfItem}
					${item.isActive ? styles.activeImg : ''}`}
					src={baseURL + item.image} alt=""
				/>

				<div>
					<p
						onClick={(e) => {
							e.stopPropagation();
							navigate(`/product/${productId}`);
						}}
						className={styles.textOfItem}
					>
						{shouldRefactorText ? refactorText(item.productName) : item.productName}
					</p>

					<div className={styles.divForTrashCanAndHeart}>
						<div
							className={styles.trashCan}
							onClick={(e) => {
								e.stopPropagation();
								onRemove();
							}}
						>
							<TrashCan itemId={item.id} />
						</div>

						<div onClick={(e) => e.stopPropagation()}>
							<Heart isProductLiked={item.isHearted} productId={productId} />
						</div>
					</div>
				</div>

				<h3 className={styles.priceOfItem}>{item.price} ₽</h3>

				<div className={styles.quantityOfItem} onClick={(e) => e.stopPropagation()}>
					<AddRemoveQuantityOfProducts
						countOfProduct={item.quantity}
						cartItemId={item.id}
						onIncrease={onIncrease}
						onDecrease={onDecrease}
					/>
				</div>
			</div>
		</div>
	);
};
