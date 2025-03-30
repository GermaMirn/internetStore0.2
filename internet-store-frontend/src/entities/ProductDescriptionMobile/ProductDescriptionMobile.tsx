import React, { useState } from 'react';
import styles from './ProductDescriptionMobile.module.css';
import { ProductDescriptionProps } from '../../interfaces';


const ProductDescriptionMobile: React.FC<ProductDescriptionProps> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const counSumbel = 200;

  const toggleDescription = () => {
    setIsExpanded(prevState => !prevState);
  };

  const truncatedDescription = description.length > counSumbel ? description.slice(0, counSumbel) + '...' : description;

  return (
    <div className={styles.description}>
      <h3>О товаре</h3>
      <p>{isExpanded ? description : truncatedDescription}</p>
      {description.length > counSumbel && (
        <p onClick={toggleDescription} className={styles.toggleButton}>
          {isExpanded ? 'Свернуть ' : 'Развернуть '}
          <img
            src={`/product/${isExpanded ? 'arrowUp.svg' : 'arrowDown.svg'}`}
            alt={isExpanded ? 'Свернуть' : 'Развернуть'}
            className={styles.arrowIcon}
          />
        </p>
      )}
    </div>
  );
};


export default ProductDescriptionMobile;
