import React, { useState } from 'react';
import styles from './ComponentSort.module.css';
import classNames from 'classnames';

const ComponentSort: React.FC = () => {
  const [isInDescendingOrder, setIsInDescendingOrder] = useState(true);

  const toggleSortOrder = () => {
    setIsInDescendingOrder(prevOrder => !prevOrder);
  };

  return (
    <div
      className={classNames(
        styles.componentSort,
        {
          [styles.inDescendingOrder]: isInDescendingOrder,
          [styles.ascendingOrder]: !isInDescendingOrder,
        }
      )}
      onClick={toggleSortOrder}
    >
      {isInDescendingOrder ? (
        <img src="/product/inDescendingOrder.svg" alt="in descending order" className={styles.inDescendingOrderImg} />
      ) : (
        <img src="/product/ascendingOrder.svg" alt="ascending order" className={styles.ascendingOrderImg} />
      )}
    </div>
  );
};

export default ComponentSort;
