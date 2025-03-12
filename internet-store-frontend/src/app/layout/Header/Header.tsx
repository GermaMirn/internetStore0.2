import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../routes/hooks/useIsMobile';
import styles from './Header.module.css';
import CategoriesMenu from '../../../entities/headerComponents/ui/CategoriesMenu/CategoriesMenu';
import SearchInput from '../../../entities/headerComponents/ui/SearchInputHeader/SearchInputHeader';
import PersonActivities from '../../../entities/headerComponents/ui/PersonActivities/PersonActivities';


export function Header() {
  const navigate = useNavigate();
  const { username, logout } = useAuth();
	const isMobile = useIsMobile();
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
    navigate('enter');
  };

	useEffect(() => {
    if (isMobile && menuCategoriesVisible) {
      navigate('/categories');
			setMenuCategoriesVisible(false);
    }
  }, [isMobile, menuCategoriesVisible, navigate]);

  return (
    <header>
      <div className={styles.mainDivOfHeader}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          <img className={styles.imgLogo} src="/header/logo.svg" alt="" />
        </div>

        <div className={styles.searchBar}>
          <div className={styles.categories} onClick={toggleCategoriesMenu}>
            <img className={styles.categoriesSvg} src="/header/categories.svg" alt="" />
            <p className={styles.categoriesText}>Категории</p>
          </div>

					{!isMobile && (
						<CategoriesMenu
							visible={menuCategoriesVisible}
							selectedCategories={selectedCategories}
							handleSearch={handleSearch}
							toggleCategoriesMenu={toggleCategoriesMenu}
							setSelectedCategories={setSelectedCategories}
						/>
					)}

          <div className={styles.divSearchInput}>
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className={styles.searchButton} onClick={handleSearch}>
          	<img className={styles.searchButtonSvg} src="/header/search.svg" alt="" />
          </div>
        </div>

				<div className={styles.personActivitiesDiv}>
					<PersonActivities
						username={username}
						onLogout={handleLogout}
						toggleMenu={toggleMenu}
						menuVisible={menuVisible}
						navigate={navigate}
					/>
				</div>
      </div>
    </header>
  );
}
