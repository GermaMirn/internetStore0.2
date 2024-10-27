import React, { useEffect, useState } from 'react';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import getShoppingCartItems from '../api/getShoppingCartItems';
import styles from './ShoppingCart.module.css'


export interface CartItemType{
	id: number;
	price: number;
	quantity: number;
	productId: number;
	productName: string;
	image: string;
	isHearted: boolean;
	isActive?: boolean;
}


const ShoppingCart: React.FC = () => {
	const [cartItems, setCartItems] = useState<CartItemType[]>([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [selectedItemsCount, setSelectedItemsCount] = useState(0);

	useEffect(() => {
		const fetchCartItems = async () => {
			try {
				const items = await getShoppingCartItems();
				setCartItems(items.map((item: CartItemType) => ({ ...item, isActive: false })));
			} catch (error) {
				console.error('Ошибка при загрузке товаров корзины:', error);
			}
		};

		fetchCartItems();
	}, []);

	const handleToggleItem = (itemId: number) => {
		setCartItems(prevItems => {
			return prevItems.map(item => {
				if (item.id === itemId) {
					const newIsActive = !item.isActive;
					return { ...item, isActive: newIsActive };
				}
				return item;
			});
		});
	};

	useEffect(() => {
		const selectedItems = cartItems.filter(item => item.isActive);
    const total = selectedItems.reduce((sum, item) => sum + Number(item.price), 0);
    const count = selectedItems.length;

		setTotalAmount(total);
		setSelectedItemsCount(count);
	}, [cartItems]);

	const handleOrderSuccess = (orderedItems: CartItemType[]) => {
    setCartItems(prevItems => prevItems.filter(item => !orderedItems.some(orderedItem => orderedItem.id === item.id)));
  };

	const selectedItems = cartItems.filter(item => item.isActive);

	return (
		<div className={styles.divForShoppingCart}>
			<div className={styles.divForCartItems}>
				{cartItems.map(item => (
					<CartItem
						key={item.id}
						item={item}
						productId={item.productId}
						onToggle={() => handleToggleItem(item.id)}
					/>
				))}
			</div>
			<CartSummary
				totalAmount={totalAmount}
				itemCount={selectedItemsCount}
				selectedItems={selectedItems}
				onOrderSuccess={handleOrderSuccess}
			/>
		</div>
	);
};


export default ShoppingCart;
