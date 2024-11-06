import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/context/AuthContext';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import styles from './Header.module.css';
import classNames from 'classnames';


export function Header() {
  const navigate = useNavigate();
  const { username, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <div className={styles.mainDivOfHeader}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          <img src="/header/logo.svg" alt="" />
        </div>

        <div className={styles.searchBar}>
          <div className={styles.categories}>
            <img className={styles.categoriesSvg} src="/header/categories.svg" alt="" />
            <p className={styles.categoriesText}>Категории</p>
          </div>
          <div className={styles.searchButton}>
            <img src="/header/search.svg" alt="" />
          </div>
        </div>

        <div className={styles.personActivities}>
          <div className={classNames(styles.favorites, styles.svgOfPersonActivities)}>
            <img className={classNames(styles.divForSvgOfPersonActivities, styles.svgOfFavorites)} src="/header/favorites.svg" alt="" onClick={() => navigate('/favorits')} />
            <p className={styles.textOfPersonActivities}>Избранные</p>
          </div>
          <div className={classNames(styles.shoppingCart, styles.svgOfPersonActivities)}>
            <img className={classNames(styles.divForSvgOfPersonActivities, styles.svgOfShoppingCart)} src="/header/shoppingCart.svg" alt="shopping cart" onClick={() => navigate('/shoppingCart')} />
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

          <ProfileMenu onLogout={handleLogout} visible={menuVisible} toggleMenu={toggleMenu} />
        </div>
      </div>
    </header>
  );
}
