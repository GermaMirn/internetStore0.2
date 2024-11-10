export interface Product {
  id: number;
  mainImageUrl: string;
  name: string;
  description: string;
  price: string;
  isHearted: boolean;
  isInCart: boolean;
  cartQuantity: number;
  cartItemId: number;
}


export interface ProductCardProps {
  product: Product;
  onQuickViewOpen: () => void;
	updateCartState: (isInCart: boolean, quantity: number, itemId: number) => void;
  updateHeartState: (isHearted: boolean) => void;
}


export interface ProductContainerProps {
  product: Product;
	onRemoveLike?: (productId: number) => void;
}


export interface QuickViewProps {
  product: Product;
  onClose: () => void;
	updateCartState: (isInCart: boolean, quantity: number, itemId: number) => void;
  updateHeartState: (isHearted: boolean) => void;
}


export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: string;
  imagesUrl: string[];
  mainImage: string;
  isHearted: boolean;
  hearts: number;
  isInCart: boolean;
  cartQuantity: number;
  cartItemId: number;
  reviews: Array<any>;
}


export interface SearchProductsResponse {
  page: number;
  total_pages: number;
  products: Product[];
}


export interface AddRemoveQuantityOfProductsProps {
  countOfProduct: number;
  cartItemId: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
}


export interface ProductActionsProps {
  productId: number;
  isInCart: boolean;
  cartQuantity: number;
  itemId: number;
  isHearted: boolean;
  updateCartState?: (isInCart: boolean, quantity: number, itemId: number) => void;
  updateHeartState?: (newHearts: boolean) => void;
}
