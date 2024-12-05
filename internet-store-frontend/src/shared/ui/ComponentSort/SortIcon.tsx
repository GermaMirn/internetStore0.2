import React from 'react';
import styles from './SortIcon.module.css';
import classNames from 'classnames';
import { SortIconProps } from '../../../interfaces';


const SortIcon: React.FC<SortIconProps> = ({ isAscending, onClick, active }) => (
  <div className={classNames(styles.componentSort, { [styles.active]: active })} onClick={onClick}>
    {isAscending ? (
      <img src="/product/inDescendingOrder.svg" alt="ascending order" className={styles.ascendingOrderImg} />
    ) : (
      <img src="/product/ascendingOrder.svg" alt="in descending order" className={styles.inDescendingOrderImg} />
    )}
  </div>
);


export default SortIcon;
