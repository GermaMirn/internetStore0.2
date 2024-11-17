import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';
import CategoriesMenu from '../../../entities/headerComponents/ui/CategoriesMenu/CategoriesMenu';
import SearchInput from '../../../entities/headerComponents/ui/SearchInputHeader/SearchInputHeader';
import PersonActivities from '../../../entities/headerComponents/ui/PersonActivities/PersonActivities';


export function Header() {
  const navigate = useNavigate();
  const { username, logout } = useAuth();
  const [menuCategoriesVisible, setMenuCategoriesVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleSearch = () => {
    navigate('/catalog', { state: { searchQuery, selectedCategories } });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  const toggleCategoriesMenu = () => {
    setMenuCategoriesVisible((prev) => !prev);
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
          <div className={styles.categories} onClick={toggleCategoriesMenu}>
            <img className={styles.categoriesSvg} src="/header/categories.svg" alt="" />
            <p className={styles.categoriesText}>Категории</p>
            <CategoriesMenu
              visible={menuCategoriesVisible}
              toggleCategoriesMenu={toggleCategoriesMenu}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>

          <div className={styles.divSearchInput}>
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className={styles.searchButton} onClick={handleSearch}>
          <img src="/header/search.svg" alt="" />
          </div>
        </div>

        <PersonActivities
          username={username}
          onLogout={handleLogout}
          toggleMenu={toggleMenu}
          menuVisible={menuVisible}
          navigate={navigate}
        />
      </div>
    </header>
  );
}
