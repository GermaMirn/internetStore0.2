import React from 'react';
import styles from './Button.module.css';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';


interface ButtonProps {
  text?: string;
	icon?: string;
	disabled?: boolean;
	username?: string;
  color?: 'notColor' | 'color';
	navigateTo?: string;
	size?: 'small' | 'medium' | 'large';
}


const Button: React.FC<ButtonProps> = ({ text, icon, username = '', color = 'notColor', navigateTo, disabled = false, size = 'medium' }) => {
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
    <button
      className={classNames(
        styles.button,
        { [styles.textButton]: text },
        { [styles.iconButton]: icon },
				{ [styles[size]]: !icon },
        styles[color],
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon ? <img src={icon} alt="icon" className={classNames(styles.icon)} /> : text}
    </button>
  );
};


export default Button;
