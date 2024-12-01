import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../app/providers/notifications/NotificationProvider';
import { useAuth } from '../../../app/context/AuthContext';
import { loginUser } from '../api/login';
import { useForm } from '../../../hooks/useForm';
import Button from '../../../shared/ui/Button';
import Input from '../../../shared/ui/Input/Input';
import styles from './Form.module.css';
import { LoginFormProps } from '../../../interfaces';


const LoginForm: React.FC<LoginFormProps> = ({ username = '' }) => {
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const { formData, errors, handleChange, validateForm, setIsLoading, isLoading } = useForm({
    username: username,
    password: '',
  });

  const validate = () => {
    return validateForm({
      username: (value) => (value ? '' : 'Имя пользователя обязательно'),
      password: (value) => (value.length >= 6 ? '' : 'Пароль должен содержать не менее 6 символов'),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await loginUser(formData);

        if (response.success) {
          navigate('/');
          login(response.profile.username);
          showNotification('Добро пожаловать!', 'success');
        } else {
          showNotification(response.message || 'Ошибка при входе. Попробуйте снова.', 'error');
        }
      } catch (error) {
        showNotification('Ошибка при входе. Попробуйте снова.', 'error');
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
          error={errors.username?.message || ''}
          className={errors.username?.className || ''}
        />

        <Input
          placeholder="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password?.message || ''}
          className={errors.password?.className || ''}
        />

        <Button text={isLoading ? 'Загрузка...' : 'Войти'} color="color" disabled={isLoading} />
      </form>
    </div>
  );
};


export default LoginForm;
