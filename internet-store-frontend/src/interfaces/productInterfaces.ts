import { ReviewItemProps } from "./reviewInterfaces";

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
	categories: string[];
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
  reviews: Array<ReviewItemProps>;
	categories: string[];
}


export interface SearchProductsResponse {
  page: number;
	searchField?: string;
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


export interface CategoriesMenuProps {
  visible: boolean;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
	toggleCategoriesMenu: () => void;
	handleSearch: () => void;
}


export interface CategoriesMenuMobileElementProps {
  nameCategorie: string;
  isSelected: boolean;
  onClick: () => void;
}


export interface CategoriesHeaderProps {
  toggleCategoriesMenu: () => void;
  selectedCategories: string[];
}


export interface CategoriesListProps {
  categories: { id: number, name: string }[];
  selectedCategories: string[];
  handleCategoryClick: (category: { id: number, name: string }) => void;
}


export interface CategoriesButtonsProps {
  handleSearch: () => void;
  handleResetCategories: () => void;
}


export interface SearchInputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
	onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}


export interface ProductCategoriesProps {
	categories: string[];
}


export interface ProductMovesProps {
  price: string;
  isInCart: boolean;
  cartQuantity: number;
  cartItemId: number;
  productId: number;
  isHearted: boolean;
  updateCartState: (isInCart: boolean, quantity: number, itemId: number) => void;
  updateHeartState: (newHearts: boolean) => void;
}