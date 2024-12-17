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


export interface CartSummaryProps {
	totalAmount: number;
	itemCount: number;
	selectedItems: CartItemType[];
	allSelected: boolean;
	onOrderSuccess: (orderedItems: CartItemType[]) => void;
	handleToggleAllItems: () => void;
}


export interface CartItemProps {
	item: CartItemType;
	productId: number;
	onToggle: () => void;
	onIncrease: () => void;
	onDecrease: () => void;
	onRemove: () => void;
}


export interface TrashCanProps {
	itemId: number;
}
