import React from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/register';
import { useNotification } from '../../../app/providers/notifications/NotificationProvider';
import Button from '../../../shared/ui/Button';
import Input from '../../../shared/ui/Input/Input';
import PhoneInput from '../../../shared/ui/Input/PhoneInput';
import styles from './Form.module.css';
import { useForm } from '../../../hooks/useForm';


const RegistrationForm: React.FC = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const { formData, errors, handleChange, setFieldError, validateForm, validatePhone, validatePassword, validateConfirmPassword, isLoading, setIsLoading } = useForm({
    username: '',
    fio: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const fioRegex = /^(?:(?:([А-ЯЁ][а-яё]+\s+|[A-Z][a-z]+\s+))([А-ЯЁ][а-яё]+|[A-Z][a-z]+)(?:\s+([А-ЯЁ][а-яё]+|[A-Z][a-z]+))?|([А-ЯЁ][а-яё]+\s+|[A-Z][a-z]+\s+)([А-ЯЁ][а-яё]+|[A-Z][a-z]+))$/;

  const validate = () => {
    const validationRules = {
      username: (value: string) => value ? '' : 'Имя пользователя обязательно',
      fio: (value: string) => !fioRegex.test(value) ? 'Неверный формат ФИО' : '',
      phone: validatePhone,
      password: validatePassword,
      confirmPassword: (value: string) => validateConfirmPassword(value, formData.password),
    };

    return validateForm(validationRules);
  };

  const handlePhoneChange = (value: string) => {
    handleChange({ target: { name: 'phone', value } } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await registerUser(formData);
        if (response.success) {
          navigate('/login', { state: { username: formData.username } });
          showNotification('Аккаунт успешно создан', 'success');
        } else {
          if (response.errorType === 'username') {
            setFieldError('username', response.message);
          }
        }
      } catch (error) {
        console.error('Ошибка при регистрации:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.divForForm}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          placeholder="Имя пользователя"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username?.message}
          className={errors.username?.className}
        />
        <Input
          placeholder="ФИО"
          name="fio"
          value={formData.fio}
          onChange={handleChange}
          error={errors.fio?.message}
          className={errors.fio?.className}
        />
        <PhoneInput
          placeholder="Номер телефона"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          error={errors.phone?.message}
          className={errors.phone?.className}
        />
        <Input
          placeholder="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password?.message}
          className={errors.password?.className}
        />
        <Input
          placeholder="Подтвердите пароль"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword?.message}
          className={errors.confirmPassword?.className}
        />
        <Button text={isLoading ? 'Загрузка...' : 'Зарегистрироваться'} color="color" disabled={isLoading} size="medium" />
      </form>
    </div>
  );
};


export default RegistrationForm;
