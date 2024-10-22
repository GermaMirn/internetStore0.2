import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';
import styles from './Form.module.css';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/auth/register';
import { loginUser } from '../../api/auth/login';


interface FormProps {
  onSubmit: (data: any) => void;
  submitText: string;
	username?: string;
  isRegistration?: boolean;
}

const Form: React.FC<FormProps> = ({ submitText, username = '', isRegistration = false }) => {
	const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: username || '',
    fio: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: { message: '', className: '' },
    fio: { message: '', className: '' },
    phone: { message: '', className: '' },
    password: { message: '', className: '' },
    confirmPassword: { message: '', className: '' },
  });

	const [isLoading, setIsLoading] = useState(false);

  const phoneRegex = /^(?:\+7|7|8)?[\s(]?(9\d{2})[\s)]?(\d{3})[-]?(\d{2})[-]?(\d{2})$/;
  const fioRegex = /^(?:(?:([А-ЯЁ][а-яё]+\s+|[A-Z][a-z]+\s+))([А-ЯЁ][а-яё]+|[A-Z][a-z]+)(?:\s+([А-ЯЁ][а-яё]+|[A-Z][a-z]+))?|([А-ЯЁ][а-яё]+\s+|[A-Z][a-z]+\s+)([А-ЯЁ][а-яё]+|[A-Z][a-z]+))$/;

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
      fio: { message: '', className: '' },
      phone: { message: '', className: '' },
      password: { message: '', className: '' },
      confirmPassword: { message: '', className: '' },
    };

    if (!formData.username) {
      newErrors.username = { message: 'Имя пользователя обязательно', className: styles.errorField };
      valid = false;
    }

		if (formData.password.length < 6) {
			newErrors.password = { message: 'Пароль должен содержать не менее 6 символов', className: styles.errorField };
			valid = false;
		}

		if (isRegistration) {
			if (isRegistration && !fioRegex.test(formData.fio)) {
				newErrors.fio = { message: 'Неверный формат ФИО', className: styles.errorField };
				valid = false;
			}

			if (!phoneRegex.test(formData.phone)) {
				newErrors.phone = { message: 'Неверный формат телефона', className: styles.errorField };
				valid = false;
			}

			if (isRegistration && formData.password !== formData.confirmPassword) {
				newErrors.confirmPassword = { message: 'Пароли не совпадают', className: styles.errorField };
				valid = false;
			}
		}

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (validate()) {
			setIsLoading(true);
			try {
				if (isRegistration) {
					const response = await registerUser(formData);

					if (response.success) {
						navigate("/login", { state: { username: formData.username } });
					} else {
						if (response.errorType === "username"){
							console.log(response)
							setErrors((prevErrors) => ({
								...prevErrors,
								username: { message: response.message, className: styles.errorField },
							}));
						}
					}

				} else {
					const response = await loginUser(formData);

					if (response.success) {
						navigate("/", { state: { username: response.username } });
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
						} else {
							setErrors((prevErrors) => ({
								...prevErrors,
								username: { message: response.message, className: styles.errorField },
								password: { message: response.message, className: styles.errorField },
							}));
						}
					}
				}
			} catch (error) {
				console.error('Ошибка при отправке формы:', error);
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

        {isRegistration && (
          <>
            <Input
              placeholder="ФИО"
              name="fio"
              value={formData.fio}
              onChange={handleChange}
              error={errors.fio.message}
              className={errors.fio.className}
            />

            <Input
              placeholder="Номер телефона"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone.message}
              className={errors.phone.className}
            />
          </>
        )}

        <Input
          placeholder="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password.message}
          className={errors.password.className}
        />

        {isRegistration && (
          <Input
            placeholder="Подтвердите пароль"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword.message}
            className={errors.confirmPassword.className}
          />
        )}

        <Button text={isLoading ? 'Закрузка...' : submitText} color="color" disabled={isLoading} />
      </form>
    </div>
  );
};


export default Form;
