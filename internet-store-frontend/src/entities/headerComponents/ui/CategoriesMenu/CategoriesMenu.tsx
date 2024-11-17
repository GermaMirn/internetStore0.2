import React, { useState, useEffect } from 'react';
import styles from './CategoriesMenu.module.css';
import { CategoriesMenuProps } from '../../../../interfaces';
import { getCategories } from '../../api/getCategories';


const CategoriesMenu: React.FC<CategoriesMenuProps> = ({ visible, toggleCategoriesMenu, selectedCategories, setSelectedCategories }) => {
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
		if (visible) {
			const fetchCategories = async () => {
				try {
					const categoriesData = await getCategories();
					setCategories(categoriesData);
				} catch (err) {
					setError('Ошибка при загрузке категорий');
				} finally {
					setLoading(false);
				}
			};
			fetchCategories();
		}
	}, [visible]);

  const handleCategoryClick = (category: { id: number, name: string }) => {
    const isActive = selectedCategories.includes(category.name);
    if (isActive) {
      setSelectedCategories((prev) => prev.filter((catName) => catName !== category.name));
    } else {
      setSelectedCategories((prev) => [...prev, category.name]);
    }
  }

  if (!visible) return null;

  return (
    <div className={styles.dropdownMenu} onClick={toggleCategoriesMenu}>
      {loading && <p>Загрузка...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && categories.length === 0 && <p>Категории не найдены</p>}
      {!loading && !error && categories.length > 0 && (
        <ul>
          {categories.map((category) => (
            <li
              key={category.id}
              className={selectedCategories.includes(category.name) ? styles.active : ''}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoriesMenu;
