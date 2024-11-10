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
}


export interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
