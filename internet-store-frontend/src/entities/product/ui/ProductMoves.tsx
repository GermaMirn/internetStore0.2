import styles from './ProductMoves.module.css';
import ProductActions from '../../../features/products/ui/ProductActions';
import { ProductMovesProps } from '../../../interfaces';


const ProductMoves: React.FC<ProductMovesProps> = ({
  price,
  isInCart,
  cartQuantity,
  cartItemId,
  productId,
  isHearted,
  updateCartState,
  updateHeartState,
}) => {
  return (
    <div className={styles.cartMoves}>
      <h2 className={styles.priceProductDetail}>{price} ₽</h2>

      <div className={styles.mainMoves}>
        <ProductActions
          isInCart={isInCart}
          cartQuantity={cartQuantity}
          itemId={cartItemId}
          productId={productId}
          isHearted={isHearted}
          updateCartState={updateCartState}
          updateHeartState={updateHeartState}
        />
      </div>
    </div>
  );
};


export default ProductMoves;
