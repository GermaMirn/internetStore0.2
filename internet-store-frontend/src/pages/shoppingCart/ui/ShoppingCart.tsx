import React, { useEffect, useState } from 'react';
import { CartItem } from '../../../entities/cartItem/CartItem';
import { CartItemMobile } from '../../../entities/cartItem/CartItemMobile';
import { CartSummary } from './CartSummary/CartSummary';
import { CartSummaryMobile } from './CartSummary/CartSummaryMobile';
import getShoppingCartItems from '../api/getShoppingCartItems';
import styles from './ShoppingCart.module.css';
import EmptyPageText from '../../../shared/ui/EmptyPageText/EmptyPageText';
import { CartItemType } from '../../../interfaces';
import { useErrorRedirect } from '../../../hooks/errorHandler';
import { useIsMobile } from '../../../app/routes/hooks/useIsMobile';


const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);
  const [allSelected, setAllSelected] = useState(false);
	const handleError = useErrorRedirect();
	const isMobile = useIsMobile();

	useEffect(() => {
	const fetchCartItems = async () => {
		try {
			const items = await getShoppingCartItems();
			setCartItems(
				items.map((item: CartItemType) => ({
					...item,
					unitPrice: Number(item.price),
					price: Number(item.price),
					isActive: false,
					}))
			);
		} catch (error) {
			handleError(error);
		}
	};

		fetchCartItems();
	}, []);

	const handleToggleItem = (itemId: number) => {
		setCartItems(prevItems =>
			prevItems.map(item => {
				if (item.id === itemId) {
					return { ...item, isActive: !item.isActive };
				}
				return item;
		})
		);
	};

	const handleQuantityChange = (itemId: number, increment: boolean, newQuantity: number) => {
		setCartItems(prevItems =>
			prevItems.map(item => {
				if (item.id === itemId) {
					const newPrice = increment ? item.price + item.productPrice : item.price - item.productPrice;
					return { ...item, quantity: newQuantity, price: newPrice };
				}
				return item;
		})
		);
	};

	useEffect(() => {
		const selectedItems = cartItems.filter(item => item.isActive);
		const total = selectedItems.reduce((sum, item) => sum + item.price, 0);
		const count = selectedItems.length;

		setTotalAmount(total);
		setSelectedItemsCount(count);
		setAllSelected(selectedItems.length === cartItems.length);
	}, [cartItems]);

	const handleOrderSuccess = (orderedItems: CartItemType[]) => {
		setCartItems(prevItems =>
			prevItems.filter(item => !orderedItems.some(orderedItem => orderedItem.id === item.id))
		);
	};

	const handleRemoveItem = (itemId: number) => {
		setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
	};


	const handleToggleAllItems = () => {
		setCartItems(prevItems => prevItems.map(item => ({ ...item, isActive: !allSelected })));
		setAllSelected(prev => !prev);
	};

	const selectedItems = cartItems.filter(item => item.isActive);

	if (cartItems.length === 0) {
		return <EmptyPageText text={'Корзина пуста'} />
	}

	return (
		<div className={isMobile ? styles.divForShoppingCartMobile : styles.divForShoppingCart}>
			<div className={isMobile ? styles.divForCartItemsMobile : styles.divForCartItems}>
				{cartItems.map(item =>
					isMobile ? (
						<CartItemMobile
							key={item.id}
							item={item}
							productId={item.productId}
							onToggle={() => handleToggleItem(item.id)}
							onIncrease={() => handleQuantityChange(item.id, true, item.quantity + 1)}
							onDecrease={() => handleQuantityChange(item.id, false, item.quantity - 1)}
							onRemove={() => handleRemoveItem(item.id)}
						/>
					) : (
						<CartItem
							key={item.id}
							item={item}
							productId={item.productId}
							onToggle={() => handleToggleItem(item.id)}
							onIncrease={() => handleQuantityChange(item.id, true, item.quantity + 1)}
							onDecrease={() => handleQuantityChange(item.id, false, item.quantity - 1)}
							onRemove={() => handleRemoveItem(item.id)}
						/>
					)
				)}
			</div>

			{cartItems.length > 0 && (
				<div className={isMobile ? styles.cartSummaryMobile : styles.cartSummary}>
					{isMobile ? (
						<CartSummaryMobile
							totalAmount={totalAmount}
							itemCount={selectedItemsCount}
							selectedItems={selectedItems}
							onOrderSuccess={handleOrderSuccess}
						/>
					) : (
						<CartSummary
							totalAmount={totalAmount}
							itemCount={selectedItemsCount}
							selectedItems={selectedItems}
							allSelected={allSelected}
							onOrderSuccess={handleOrderSuccess}
							handleToggleAllItems={handleToggleAllItems}
						/>
					)}
				</div>
			)}
		</div>
	);
};


export default ShoppingCart;
