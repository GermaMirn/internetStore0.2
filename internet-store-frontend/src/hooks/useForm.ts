import { useState } from 'react';

export interface FormState {
  [key: string]: string;
}

export interface ErrorState {
  [key: string]: { message: string; className: string };
}

export const useForm = <T extends FormState>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<ErrorState>({});
  const [isLoading, setIsLoading] = useState(false);

  // Обработка изменений в полях
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Сброс ошибки для текущего поля
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: { message: '', className: '' },
    }));
  };

  // Установка ошибки для определенного поля
  const setFieldError = (field: string, message: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: { message, className: 'errorField' },
    }));
  };

  // Валидация всей формы
  const validateForm = (validationRules: Record<string, (value: string) => string>) => {
    let valid = true;
    const newErrors: ErrorState = {};
    Object.keys(validationRules).forEach((field) => {
      const errorMessage = validationRules[field](formData[field]);
      if (errorMessage) {
        valid = false;
        newErrors[field] = { message: errorMessage, className: 'errorField' };
      }
    });
    setErrors(newErrors);
    return valid;
  };

  // Валидация телефона
	const validatePhone = (phone: string): string => {
		// Регулярное выражение для валидации номера телефона в формате +79527910927
		const phoneRegex = /^\+?[7-8][0-9]{10}$/;
		return phoneRegex.test(phone) ? '' : 'Неверный формат телефона';
	};

  // Валидация пароля
  const validatePassword = (password: string): string => {
    if (password.length < 6) {
      return 'Пароль должен быть не менее 6 символов';
    }
    return '';
  };

  // Валидация подтверждения пароля
  const validateConfirmPassword = (confirmPassword: string, password: string): string => {
    return confirmPassword === password ? '' : 'Пароли не совпадают';
  };

  return {
    formData,
    errors,
    handleChange,
    setFieldError,
    isLoading,
    setIsLoading,
    validateForm,
    validatePhone,
    validatePassword,
    validateConfirmPassword,
  };
};
