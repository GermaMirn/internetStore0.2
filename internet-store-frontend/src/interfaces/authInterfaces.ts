export interface LoginData {
  username: string;
  password: string;
}


export interface RegisterData {
  username: string;
  fio: string;
  phone: string;
  password: string;
  confirmPassword: string;
}


export interface LoginFormProps {
  username?: string;
}


export interface UpdateUserData {
	username?: string;
	password?: string;
	currentPassword?: string;
	fullname?: string;
	phoneNumber?: string;
}


export interface EditProfileProps {
  handleClose: () => void;
}


export interface FooterMobileProps {
	username: string | null;
}
