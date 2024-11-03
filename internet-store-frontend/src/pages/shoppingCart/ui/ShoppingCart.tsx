import React, { useEffect, useState } from 'react';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import getShoppingCartItems from '../api/getShoppingCartItems';
import styles from './ShoppingCart.module.css';


export interface CartItemType {
  id: number;
  price: number;
  quantity: number;
  productId: number;
  productName: string;
	productPrice: number;
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
        setCartItems(
          items.map((item: CartItemType) => ({
            ...item,
            unitPrice: Number(item.price),
            price: Number(item.price),
            isActive: false,
          }))
        );
      } catch (error) {
        console.error('Ошибка при загрузке товаров корзины:', error);
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

  const handleQuantityChange = (itemId: number, increment: boolean) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const newPrice = increment ? item.price + item.productPrice : item.price - item.productPrice;
          return { ...item, price: newPrice };
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
  }, [cartItems]);

  const handleOrderSuccess = (orderedItems: CartItemType[]) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !orderedItems.some(orderedItem => orderedItem.id === item.id))
    );
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
            onIncrease={() => handleQuantityChange(item.id, true)}
            onDecrease={() => handleQuantityChange(item.id, false)}
          />
        ))}
      </div>
			<div className={styles.cartSummary}>
				<CartSummary
					totalAmount={totalAmount}
					itemCount={selectedItemsCount}
					selectedItems={selectedItems}
					onOrderSuccess={handleOrderSuccess}
				/>
			</div>
    </div>
  );
};


export default ShoppingCart;
