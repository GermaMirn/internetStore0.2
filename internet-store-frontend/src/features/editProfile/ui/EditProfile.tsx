import React, { useState, useEffect } from 'react';
import PhoneInput from '../../../shared/ui/Input/PhoneInput';
import Input from '../../../shared/ui/Input/Input';
import styles from './EditProfile.module.css';
import { updateUserInfo } from '../api/changeUserData';
import { UpdateUserData, EditProfileProps } from '../../../interfaces';
import { useAuth } from '../../../app/context/AuthContext';
import { useForm } from '../../../hooks/useForm';
import { useNotification } from '../../../app/providers/notifications/NotificationProvider';


const EditProfile: React.FC<EditProfileProps> = ({ handleClose }) => {
  const { updateUserData } = useAuth();
  const { showNotification } = useNotification()

  const storedFullName = localStorage.getItem('fullname') || '';
  const storedPhoneNumber = localStorage.getItem('phoneNumber') || '';
  const storedUsername = localStorage.getItem('username') || '';

  const { formData, errors, handleChange, setFieldError, isLoading, setIsLoading, validatePhone, validateForm } = useForm({
    fio: storedFullName,
    username: storedUsername,
    phoneNumber: storedPhoneNumber,
  });

  const [isChanged, setIsChanged] = useState<boolean>(false);

  const fioRegex = /^(?:(?:([А-ЯЁ][а-яё]+\s+|[A-Z][a-z]+\s+))([А-ЯЁ][а-яё]+|[A-Z][a-z]+)(?:\s+([А-ЯЁ][а-яё]+|[A-Z][a-z]+))?|([А-ЯЁ][а-яё]+\s+|[A-Z][a-z]+\s+)([А-ЯЁ][а-яё]+|[A-Z][a-z]+))$/;

  useEffect(() => {
    const isDataChanged = formData.fio !== storedFullName || formData.username !== storedUsername || formData.phoneNumber !== storedPhoneNumber;
    setIsChanged(isDataChanged);
  }, [formData, storedFullName, storedUsername, storedPhoneNumber]);

  const handlePhoneChange = (newPhone: string) => {
    handleChange({ target: { name: 'phoneNumber', value: newPhone } } as React.ChangeEvent<HTMLInputElement>);
    const phoneError = validatePhone(newPhone);
    if (phoneError) {
      setFieldError('phoneNumber', phoneError);
    } else {
      setFieldError('phoneNumber', '');
    }
  };

  const handleSave = async () => {
    const validationRules = {
      fio: (value: string) => !fioRegex.test(value) ? 'Неверный формат ФИО' : '',
      username: (value: string) => value.length < 1 ? 'Имя пользователя обязательно' : '',
      phoneNumber: validatePhone,
    };

    const isValid = validateForm(validationRules);
    if (!isValid) {
      showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
      return;
    }

    const updateData: UpdateUserData = {
      username: formData.username,
      fullname: formData.fio,
      phoneNumber: formData.phoneNumber,
    };

    try {
      const response = await updateUserInfo(updateData);

      if (response.success) {
        showNotification('Данные успешно обновлены', 'success');
        updateUserData(formData.username, formData.fio, formData.phoneNumber);
        handleClose();
      } else {
        showNotification(response.message || 'Ошибка при сохранении данных', 'error');
      }
    } catch (error) {
      showNotification('Произошла ошибка при обновлении данных', 'error');
    }
  };

  const isFormValid = !errors.fio?.message && !errors.username?.message && !errors.phoneNumber?.message && isChanged;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Редактирование профиля</h2>

        <div className={styles.inputGroup}>
          <Input
            placeholder="Имя пользователя"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username?.message}
            className={errors.username?.className}
            isEdit={true}
          />
        </div>

        <div className={styles.inputGroup}>
          <PhoneInput
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            error={errors.phoneNumber?.message}
            placeholder="Номер телефона"
            isEdit={true}
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            placeholder="ФИО"
            name="fio"
            value={formData.fio}
            onChange={handleChange}
            error={errors.fio?.message}
            className={errors.fio?.className}
            isEdit={true}
          />
        </div>

        <div className={styles.buttonsContainer}>
          <button
            className={`${styles.cancelButton}`}
            onClick={handleClose}
          >
            Отмена
          </button>
          <button
            className={`${styles.saveButton} ${isFormValid ? styles.active : ''}`}
            onClick={handleSave}
            disabled={!isFormValid}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};


export default EditProfile;
