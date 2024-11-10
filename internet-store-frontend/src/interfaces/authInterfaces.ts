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
