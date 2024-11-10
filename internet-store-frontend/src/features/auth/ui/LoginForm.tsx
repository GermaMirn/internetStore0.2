import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/login';
import { useNotification } from '../../../app/providers/notifications/NotificationProvider';
import { useAuth } from '../../../app/context/AuthContext';
import Button from '../../../shared/ui/Button';
import Input from '../../../shared/ui/Input/Input';
import styles from './Form.module.css';
import { LoginFormProps } from '../../../interfaces';


const LoginForm: React.FC<LoginFormProps> = ({ username = '' }) => {
	const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: username,
    password: '',
  });

  const [errors, setErrors] = useState({
    username: { message: '', className: '' },
    password: { message: '', className: '' },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: { message: '', className: '' },
    }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      username: { message: '', className: '' },
      password: { message: '', className: '' },
    };

    if (!formData.username) {
      newErrors.username = { message: 'Имя пользователя обязательно', className: styles.errorField };
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = { message: 'Пароль должен содержать не менее 6 символов', className: styles.errorField };
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await loginUser(formData);

        if (response.success) {
          navigate("/");
					login(response.profile.username);
          showNotification('Добро пожаловать!', 'success');
        } else {
          if (response.errorType === 'username') {
            setErrors((prevErrors) => ({
              ...prevErrors,
              username: { message: response.message, className: styles.errorField },
            }));
          } else if (response.errorType === 'password') {
            setErrors((prevErrors) => ({
              ...prevErrors,
              password: { message: response.message, className: styles.errorField },
            }));
          }
        }
      } catch (error) {
        console.error('Ошибка при входе:', error);
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
          error={errors.username.message}
          className={errors.username.className}
        />
        <Input
          placeholder="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password.message}
          className={errors.password.className}
        />
        <Button text={isLoading ? 'Загрузка...' : 'Войти'} color="color" disabled={isLoading} />
      </form>
    </div>
  );
};


export default LoginForm;
