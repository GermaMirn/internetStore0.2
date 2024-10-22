import React, { ChangeEvent, useState } from 'react';
import styles from './Input.module.css';
import classNames from 'classnames';


interface InputProps {
  name: string;
  value: string;
  placeholder: string;
  className?: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}


const Input: React.FC<InputProps> = ({ name, value, placeholder, type = 'text', className, onChange, error }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const showPlaceholder = !isFocused && value === '';

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={styles.inputWrapper}>
      {showPlaceholder && <p className={styles.placeholder}>{placeholder}</p>}
      <input
        className={classNames(styles.input, className, { [styles.inputError]: !!error })}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};


export default Input;
