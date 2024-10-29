import React, { useState } from 'react';
import { CartItemType } from './ShoppingCart';
import styles from './CartItem.module.css';
import AddRemoveQuantityOfProducts from '../../../shared/ui/AddRemoveQuantityOfProducts/AddRemoveQuantityOfProducts';
import Heart from '../../../shared/ui/Heart/Heart';
import TrashCan from '../../../shared/ui/TrashCan';

interface CartItemProps {
	item: CartItemType;
	productId: number;
	onToggle: () => void;
	onIncrease: () => void;
  onDecrease: () => void;
}

const baseUrl = 'http://127.0.0.1:8000/';

export const CartItem: React.FC<CartItemProps> = ({ item, productId, onToggle, onIncrease, onDecrease }) => {
	const [isVisible, setIsVisible] = useState(true);

	const handleRemoveClick = () => {
		setIsVisible(false);
	};

	return (
		<div>
			{isVisible && (
				<div
					className={`${styles.divOfCartItems} ${item.isActive ? styles.active : ''}`}
					onClick={onToggle}
				>
					<img className={styles.imgOfItem} src={baseUrl + item.image} alt="" />

					<div>
						<p className={styles.textOfItem}>{item.productName}</p>

						<div className={styles.divForTrashCanAndHeart}>

							<div
								className={styles.trashCan}
								onClick={(e) => {
									e.stopPropagation();
									handleRemoveClick();
								}}
							>
								<TrashCan itemId={item.id} />
							</div>

							<div
								onClick={(e) => e.stopPropagation()}
							>
								<Heart isProductLiked={item.isHearted} productId={productId} />
							</div>

						</div>
					</div>

					<h3 className={styles.priceOfItem}>{item.price} ₽</h3>

					<div
						className={styles.quantityOfItem}
						onClick={(e) => e.stopPropagation()}
					>
						<AddRemoveQuantityOfProducts
							countOfProduct={item.quantity}
							cartItemId={item.id}
							onIncrease={onIncrease}
							onDecrease={onDecrease}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
