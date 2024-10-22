import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';
import styles from './Form.module.css';

interface FormProps {
  onSubmit: (data: any) => void;
  submitText: string;
	username?: string;
  isRegistration?: boolean;
}

const Form: React.FC<FormProps> = ({ onSubmit, submitText, username = '', isRegistration = false }) => {
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

    if (isRegistration && !fioRegex.test(formData.fio)) {
      newErrors.fio = { message: 'Неверный формат ФИО', className: styles.errorField };
      valid = false;
    }

    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = { message: 'Неверный формат телефона', className: styles.errorField };
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = { message: 'Пароль должен содержать не менее 6 символов', className: styles.errorField };
      valid = false;
    }

    if (isRegistration && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = { message: 'Пароли не совпадают', className: styles.errorField };
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
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

        <Button text={submitText} color="color" />
      </form>
    </div>
  );
};

export default Form;
