import React from 'react';
import classNames from 'classnames';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import styles from './PersonActivities.module.css';


interface PersonActivitiesProps {
  username: string | null;
  onLogout: () => void;
  toggleMenu: () => void;
  menuVisible: boolean;
  navigate: (path: string) => void;
}


const PersonActivities: React.FC<PersonActivitiesProps> = ({ username, onLogout, toggleMenu, menuVisible, navigate }) => {
  return (
    <div className={styles.personActivities}>
      <div className={classNames(styles.favorites, styles.svgOfPersonActivities)}>
        <img
          className={classNames(styles.divForSvgOfPersonActivities, styles.svgOfFavorites)}
          src="/header/favorites.svg"
          alt=""
          onClick={() => navigate('/favorits')}
        />
        <p className={styles.textOfPersonActivities}>Избранные</p>
      </div>

      <div className={classNames(styles.shoppingCart, styles.svgOfPersonActivities)}>
        <img
          className={classNames(styles.divForSvgOfPersonActivities, styles.svgOfShoppingCart)}
          src="/header/shoppingCart.svg"
          alt="shopping cart"
          onClick={() => navigate('/shoppingCart')}
        />
        <p className={classNames(styles.textOfPersonActivities, styles.testForShoppingCart)}>Корзина</p>
      </div>

      {username ? (
        <div className={classNames(styles.profile, styles.svgOfPersonActivities)} onClick={toggleMenu}>
          <img className={classNames(styles.divForSvgOfPersonActivities, styles.svgOfProfile)} src="/header/profile.svg" alt="" />
          <p className={styles.textOfPersonActivities}>{username}</p>
        </div>
      ) : (
        <div className={classNames(styles.profile, styles.svgOfPersonActivities)} onClick={() => navigate('/enter')}>
          <img className={classNames(styles.divForSvgOfPersonActivities, styles.svgOfProfile)} src="/header/profile.svg" alt="" />
          <p className={styles.textOfPersonActivities}>Войти</p>
        </div>
      )}

      <ProfileMenu onLogout={onLogout} visible={menuVisible} toggleMenu={toggleMenu} />
    </div>
  );
};


export default PersonActivities;
