import React from 'react';
import styles from './Cross.module.css';
import classNames from 'classnames';


interface CrossProps {
	size: 'medium' | 'large';
}


const Cross: React.FC<CrossProps> = ({ size = 'medium' }) => {

  return (
    <div
      className={classNames(
        styles.cross,
        styles[size]
      )}
    >
      &#10005;
    </div>
  );
};


export default Cross;
