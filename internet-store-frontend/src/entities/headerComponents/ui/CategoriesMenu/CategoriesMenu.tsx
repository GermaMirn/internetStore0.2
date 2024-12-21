import React, { useState, useEffect } from 'react';
import styles from './CategoriesMenu.module.css';
import { CategoriesMenuProps } from '../../../../interfaces';
import { getCategories } from '../../api/getCategories';
import CategoriesHeader from './CategoriesHeader/CategoriesHeader';
import CategoriesList from './CategoriesList/CategoriesList';
import CategoriesActions from './CategoriesActions/CategoriesActions';
import { useErrorRedirect } from '../../../../hooks/errorHandler';


const CategoriesMenu: React.FC<CategoriesMenuProps> = ({ visible, selectedCategories, setSelectedCategories, toggleCategoriesMenu, handleSearch }) => {
	const handleError = useErrorRedirect();
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (visible) {
      const fetchCategories = async () => {
        try {
          const categoriesData = await getCategories();
          setCategories(categoriesData);
        } catch (error) {
          handleError(error)
        } finally {
          setLoading(false);
        }
      };
      fetchCategories();
    }
  }, [visible]);

  const handleResetCategories = () => {
    setSelectedCategories([]);
  };

  const handleCategoryClick = (category: { id: number, name: string }) => {
    const isActive = selectedCategories.includes(category.name);
    if (isActive) {
      setSelectedCategories((prev) => prev.filter((catName) => catName !== category.name));
    } else {
      setSelectedCategories((prev) => [...prev, category.name]);
    }
  };

  if (!visible) return null;

  return (
    <div className={styles.dropdownMenu}>
      {loading && <p>Загрузка...</p>}
      {!loading && categories.length >= 0 && (
        <div>
          <CategoriesHeader
            toggleCategoriesMenu={toggleCategoriesMenu}
            selectedCategories={selectedCategories}
          />

          <CategoriesList
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryClick={handleCategoryClick}
          />

          <CategoriesActions
            handleSearch={handleSearch}
            handleResetCategories={handleResetCategories}
          />
        </div>
      )}
    </div>
  );
};


export default CategoriesMenu;
