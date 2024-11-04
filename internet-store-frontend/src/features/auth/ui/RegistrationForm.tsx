import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/register';
import { useNotification } from '../../../app/providers/notifications/NotificationProvider';
import Button from '../../../shared/ui/Button';
import Input from '../../../shared/ui/Input/Input';
import PhoneInput from '../../../shared/ui/Input/PhoneInput';
import styles from './Form.module.css';


const RegistrationForm: React.FC = () => {
	const { showNotification } = useNotification();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: '',
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

	const fioRegex = /^(?:(?:([А-ЯЁ][а-яё]+\s+|[A-Z][a-z]+\s+))([А-ЯЁ][а-яё]+|[A-Z][a-z]+)(?:\s+([А-ЯЁ][а-яё]+|[A-Z][a-z]+))?|([А-ЯЁ][а-яё]+\s+|[A-Z][a-z]+\s+)([А-ЯЁ][а-яё]+|[A-Z][a-z]+))$/;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => {
			const updatedData = { ...prevData, [name]: value };
			return updatedData;
		});
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: { message: '', className: '' },
		}));
	};

	const handlePhoneChange = (value: string) => {
		setFormData((prevData) => ({
			...prevData,
			phone: value,
		}));
		setErrors((prevErrors) => ({
			...prevErrors,
			phone: { message: '', className: '' },
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

		if (!fioRegex.test(formData.fio)) {
			newErrors.fio = { message: 'Неверный формат ФИО', className: styles.errorField };
			valid = false;
		}

		if (formData.phone.length < 12) {
			newErrors.phone = { message: 'Неверный формат телефона', className: styles.errorField };
			valid = false;
		}

		if (formData.password.length < 6) {
			newErrors.password = { message: 'Пароль должен содержать не менее 6 символов', className: styles.errorField };
			valid = false;
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = { message: 'Пароли не совпадают', className: styles.errorField };
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
				const response = await registerUser(formData);
				if (response.success) {
					navigate("/login", { state: { username: formData.username } });
					showNotification('Аккаунт успешно создан', 'success')
				} else {
					if (response.errorType === "username") {
						setErrors((prevErrors) => ({
							...prevErrors,
							username: { message: response.message, className: styles.errorField },
						}));
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
					error={errors.username.message}
					className={errors.username.className}
				/>
				<Input
					placeholder="ФИО"
					name="fio"
					value={formData.fio}
					onChange={handleChange}
					error={errors.fio.message}
					className={errors.fio.className}
				/>
				<PhoneInput
					placeholder="Номер телефона"
					name="phone"
					value={formData.phone}
					onChange={handlePhoneChange}
					error={errors.phone.message}
					className={errors.phone.className}
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
				<Input
					placeholder="Подтвердите пароль"
					name="confirmPassword"
					type="password"
					value={formData.confirmPassword}
					onChange={handleChange}
					error={errors.confirmPassword.message}
					className={errors.confirmPassword.className}
				/>
				<Button text={isLoading ? 'Загрузка...' : 'Зарегистрироваться'} color="color" disabled={isLoading} />
			</form>
		</div>
	);
};


export default RegistrationForm;
