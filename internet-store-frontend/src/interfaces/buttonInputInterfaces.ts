import { ChangeEvent } from 'react';


export interface ButtonProps {
  text?: string;
	icon?: string;
	disabled?: boolean;
	username?: string;
  color?: 'notColor' | 'color';
	navigateTo?: string;
	size?: 'small' | 'medium' | 'large';
}


export interface InputProps {
  name: string;
  value: string;
  placeholder: string;
  className?: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}


export interface PhoneInputProps {
	name: string;
	value: string;
	placeholder: string;
	className?: string;
	onChange: (value: string) => void;
	error?: string;
	isEdit?: boolean;
}


export interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}


export interface ReturnArrowProps {
  arrowSrc: string;
}


export interface ProductMobileActionButtonCartProps {
  productId: number;
  cartQuantity: number;
  isInCart: boolean;
  cartItemId: number;
  updateCartState: (isInCart: boolean, quantity: number, itemId: number) => void
}