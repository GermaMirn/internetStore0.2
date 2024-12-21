import React from 'react';
import { QuickViewProps } from '../../../interfaces';
import styles from './QuickView.module.css';
import Cross from '../../../shared/ui/Cross/Cross';
import ProductActions from '../../../features/products/ui/ProductActions';
import { baseURL } from '../../../shared/api/axiosInstance';


const QuickView: React.FC<QuickViewProps> = ({
  product,
  onClose,
	updateCartState,
  updateHeartState,
}) => {
  return (
    <div className={styles.quickViewOverlay}>
      <div className={styles.quickView}>
        <img className={styles.imgOfQuickView} src={`${baseURL}${product.mainImageUrl}`} alt={product.name} />
        <div className={styles.textOfQuickView}>
          <h2 className={styles.nameOfProduct}>{product.name}</h2>
          <h1 className={styles.priceOfQuickView}>{product.price} ₽</h1>
          <h2>О товаре</h2>
          <h4 className={styles.descriptionOfQuickView}>{product.description}</h4>

					<div className={styles.productActions}>
						<ProductActions
							isInCart={product.isInCart}
							cartQuantity={product.cartQuantity}
							itemId={product.cartItemId}
							productId={product.id}
							isHearted={product.isHearted}
							updateCartState={updateCartState}
							updateHeartState={updateHeartState}
						/>
					</div>
        </div>
      </div>
      <div onClick={onClose} className={styles.cross}>
        <Cross size="medium" />
      </div>
    </div>
  );
};


export default QuickView;
