import { useState, useEffect } from 'react';
import styles from './CategoriesMenuMobilePage.module.css';
import { getCategories } from '../../../entities/headerComponents/api/getCategories';
import { useErrorRedirect } from '../../../hooks/errorHandler';
import { useNavigate } from 'react-router-dom';
import CategoriesMenuMobileElement from '../../../features/categoriesMenuMobileElement/ui/CategoriesMenuMobileElement';
import SearchActions from '../../../features/categoriesMenuMobileElement/ui/SearchActions/SearchActions';


const CategoriesMenuMobilePage = () => {
	const navigate = useNavigate();
  const handleError = useErrorRedirect();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: { id: number; name: string }) => {
    const isActive = selectedCategories.includes(category.name);
    if (isActive) {
      setSelectedCategories((prev) => prev.filter((catName) => catName !== category.name));
    } else {
      setSelectedCategories((prev) => [...prev, category.name]);
    }
  };

  const handleResetCategories = () => {
    setSelectedCategories([]);
  };

  const handleSearch = () => {
    navigate('/catalog', { state: { selectedCategories } });
  };

  return (
    <div className={styles.dropdownMenu}>
      <h1>Категории</h1>
      {loading && <p>Загрузка...</p>}
      {!loading && categories.length > 0 && (
        <div className={styles.divCategoriesElements}>
          {categories.map((category) => (
            <CategoriesMenuMobileElement
              key={category.id}
              nameCategorie={category.name}
              isSelected={selectedCategories.includes(category.name)}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      )}

			<div className={styles.searchActions}>
      	<SearchActions onReset={handleResetCategories} onSearch={handleSearch} />
			</div>
    </div>
  );
};


export default CategoriesMenuMobilePage;
