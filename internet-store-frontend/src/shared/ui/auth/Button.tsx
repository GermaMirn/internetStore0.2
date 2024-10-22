import React from 'react';
import styles from './Button.module.css';
import { useNavigate } from 'react-router-dom';


interface ButtonProps {
  text: string;
	disabled?: boolean;
	username?: string;
  color?: 'notColor' | 'color';
	navigateTo?: string;
}


const Button: React.FC<ButtonProps> = ({ text, username = '', color = 'notColor', navigateTo, disabled = false }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		if (navigateTo) {
			if (!disabled && navigateTo === "/login") {
				navigate(navigateTo, { state: { username } });
			} else {
				navigate(navigateTo);
			}
		}
  };

  return (
    <button className={`${styles.button} ${styles.size} ${styles[color]}`} onClick={handleClick}>
      {text}
    </button>
  );
};


export default Button;
