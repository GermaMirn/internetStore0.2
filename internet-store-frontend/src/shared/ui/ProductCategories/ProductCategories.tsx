import styles from './ProductCategories.module.css';
import { ProductCategoriesProps } from '../../../interfaces';
import { useNavigate } from 'react-router-dom';


const ProductCategories: React.FC<ProductCategoriesProps> = ({ categories }) => {
	const navigate = useNavigate();

	const handleSearch = (selectedCategories: string[]) => {
    navigate('/catalog', { state: { selectedCategories } });
  };

  return (
    <div className={styles.productCategories}>
			<p className={styles.title}>категории товара:</p>
      {categories.map((category, index) => (
        <p key={index} className={styles.category} onClick={() => handleSearch([category])}>
          {category}
        </p>
      ))}
    </div>
  );
};

export default ProductCategories;
