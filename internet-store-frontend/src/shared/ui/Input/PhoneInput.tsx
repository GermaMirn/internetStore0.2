import React, { ChangeEvent, useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './Input.module.css';
import { PhoneInputProps } from '../../../interfaces';


const PhoneInput: React.FC<PhoneInputProps> = ({
  name,
  value,
  placeholder,
  className,
  onChange,
  error,
  isEdit = false,
}) => {
  const [inputValue, setInputValue] = useState<string>(value || '+7');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (!newValue.startsWith('+7')) {
      newValue = '+7' + newValue.replace(/\D/g, '');
    } else {
      newValue = '+7' + newValue.slice(2).replace(/\D/g, '').slice(0, 10);
    }

    setInputValue(newValue);
    onChange(newValue);
  };

  useEffect(() => {
    setInputValue(value || '+7');
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const placeholderStyle = {
    marginLeft: isEdit ? '40px' : '105px',
  };

  return (
    <div className={styles.inputWrapper}>
      {!isFocused && inputValue === '+7' && (
        <p className={styles.placeholder} style={placeholderStyle}>
          {placeholder}
        </p>
      )}
      <input
        className={classNames(
          { [styles.inputError]: !!error, [styles.input]: !error },
          className
        )}
        type="text"
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        inputMode="numeric"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};


export default PhoneInput;
