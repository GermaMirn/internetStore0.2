import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductDetail } from '../api/getProductDetail';
import ProductActions from '../../../features/products/ui/ProductActions';
import ImagesCarousel from './ImagesCarousel';
import ReviewsContainer from './ReviewsContainer/ReviewsContainer/ReviewsContainer';
import styles from './ProductDetail.module.css';


interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: string;
  imagesUrl: string[];
  mainImage: string;
  isHearted: boolean;
  hearts: number;
  isInCart: boolean;
  cartQuantity: number;
  cartItemId: number;
  reviews: Array<any>;
}


const ProductDetail = () => {
  const baseURL = 'http://127.0.0.1:8000';
  const { id } = useParams<{ id?: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImage, setCurrentImage] = useState<string>('');
	const [hearts, setHearts] = useState<number>(0);

  useEffect(() => {
    const loadProductDetail = async () => {
      if (id) {
        try {
          const fetchedProduct = await getProductDetail(id);
          setProduct(fetchedProduct);
          setCurrentImage(fetchedProduct.mainImage);
					setHearts(fetchedProduct.hearts);
        } catch (err) {
          console.log('Error fetching product detail:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadProductDetail();
  }, [id]);

	const updateHearts = (newHearts: boolean) => {
		setHearts(prevHearts => prevHearts + (newHearts ? 1 : -1));
	};

	const updateCartState = (isInCart: boolean, quantity: number, itemId: number) => {
		setProduct(prevProduct => ({
			...prevProduct!,
			isInCart,
			cartQuantity: quantity,
			cartItemId: itemId,
		}));
	};

  if (loading) return <div>Loading...</div>;

  if (!product) return <div>No product found</div>;

  return (
    <div className={styles.mainDivProductDetail}>
      <div className={styles.divForProductDetail}>
        <div className={styles.imgsAndImgOfProductDetail}>
          <ImagesCarousel
            imagesUrl={product.imagesUrl}
            mainImage={product.mainImage}
            onImageSelect={setCurrentImage}
          />

          <div className={styles.mainImage}>
            <img className={styles.imgOfProductDetail} src={baseURL + currentImage} alt={product.name} />
          </div>
        </div>

        <div className={styles.infoProductDetail}>
          <div className={styles.nameProductDetail}>
            <h2>{product.name}</h2>
          </div>

          <div className={styles.descriptionProductDetail}>
            <h3>О товаре</h3>
            <p>{product.description}</p>
          </div>
        </div>

        <div className={styles.cartMoves}>
          <h2 className={styles.priceProductDetail}>{product.price} ₽</h2>

          <div className={styles.mainMoves}>
            <ProductActions
              isInCart={product.isInCart}
              cartQuantity={product.cartQuantity}
              itemId={product.cartItemId}
              productId={product.id}
              isHearted={product.isHearted}
							updateCartState={updateCartState}
							updateHeartState={updateHearts}
            />
          </div>
        </div>
      </div>

      <ReviewsContainer reviews={product.reviews} hearts={hearts} />
    </div>
  );
};


export default ProductDetail;
