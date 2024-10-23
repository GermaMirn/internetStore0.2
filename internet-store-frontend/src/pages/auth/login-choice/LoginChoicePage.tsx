import React, { useState }  from 'react';
import Button from '../../../shared/ui/Button';
import styles from '../Auth.module.css';
import Input from '../../../shared/ui/Input/Input';


const LoginChoicePage: React.FC = () => {
	const [username, setUsername] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <div className={styles.divForEnterForm}>
      <h1 className={styles.textOfForms}>Войти в аккаунт</h1>

			<div className={styles.divForButtons}>
				<Input
          placeholder="Имя пользователя"
          name="username"
          value={username}
          onChange={handleInputChange}
        />

				<Button text="Войти" color="color" navigateTo="/login" username={username} />
				<hr className={styles.hr} />
				<Button text="Создать Аккаунт" color="notColor" navigateTo="/register"  />
				<Button text="Продолжить как гость" color="notColor" navigateTo="/"  />
			</div>

    </div>
  );
};


export default LoginChoicePage;
