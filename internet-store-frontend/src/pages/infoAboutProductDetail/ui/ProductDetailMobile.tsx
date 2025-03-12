import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductDetail } from '../api/getProductDetail';
import { ProductDetail } from '../../../interfaces';
import { addReview } from '../api/addCommentReview/addReview';
import ReviewsContainer from '../../../entities/ReviewsContainer/ReviewsContainer';
import styles from './ProductDetail.module.css';
import { baseURL } from '../../../shared/api/axiosInstance';
import { useErrorRedirect } from '../../../hooks/errorHandler';
import ProductCategories from '../../../shared/ui/ProductCategories/ProductCategories';
import EmptyPageText from '../../../shared/ui/EmptyPageText/EmptyPageText';
import ProductMoves from '../../../entities/product/ui/ProductMoves';


const ProductDetailMobilePage = () => {
  const { id } = useParams<{ id?: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
	const [reviews, setReviews] = useState(product?.reviews || []);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImage, setCurrentImage] = useState<string>('');
	const [hearts, setHearts] = useState<number>(0);
	const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
	const handleError = useErrorRedirect();

  useEffect(() => {
    const loadProductDetail = async () => {
      if (id) {
        try {
          const fetchedProduct = await getProductDetail(id);
          setProduct(fetchedProduct);
          setCurrentImage(fetchedProduct.mainImage);
					setHearts(fetchedProduct.hearts);
					setReviews(fetchedProduct.reviews);
        } catch (error) {
          handleError(error);
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

	const toggleReviewForm = () => {
    setIsReviewFormOpen(prevState => !prevState);
  };

	const handleSubmitReview = async (commentText: string, images: File[]) => {
    try {
      const formData = new FormData();
      formData.append('review', commentText);
      images.forEach((image) => {
        formData.append('image', image);
      });

      const newReview = await addReview(String(id), formData);
			setReviews(prevReviews => {
				const updatedReviews = [...prevReviews, newReview];
				return updatedReviews;
			});


      setIsReviewFormOpen(false);
    } catch (error) {
      handleError(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <EmptyPageText text='Продукт не найден' />;

  return (
    <div className={styles.mainDivProductDetail}>
      <div className={styles.divForProductDetail}>
        <div className={styles.imgsAndImgOfProductDetail}>
          <div className={styles.mainImage}>
            <img className={styles.imgOfProductDetail} src={baseURL + currentImage} alt={product.name} />
          </div>
        </div>

        <div className={styles.infoProductDetail}>
          <div className={styles.nameProductDetail}>
            <h2>{product.name}</h2>
            <h2>{product.price}</h2>
          </div>

          <div className={styles.productActionsDesctopMin}>
            <ProductMoves
              price={product.price}
              isInCart={product.isInCart}
              cartQuantity={product.cartQuantity}
              cartItemId={product.cartItemId}
              productId={product.id}
              isHearted={product.isHearted}
              updateCartState={updateCartState}
              updateHeartState={updateHearts}
            />
          </div>

          <div className={styles.categories}>
            <ProductCategories categories={product.categories} />
          </div>

          <div className={styles.descriptionProductDetailDesctopFull}>
            <h3>О товаре</h3>
            <p>{product.description}</p>
          </div>
        </div>

        <div className={styles.productActionsDesctopFull}>
          <ProductMoves
            price={product.price}
            isInCart={product.isInCart}
            cartQuantity={product.cartQuantity}
            cartItemId={product.cartItemId}
            productId={product.id}
            isHearted={product.isHearted}
            updateCartState={updateCartState}
            updateHeartState={updateHearts}
          />
        </div>
      </div>

      <div className={styles.descriptionProductDetailDesctopMin}>
        <h3>О товаре</h3>
        <p>{product.description}</p>
      </div>

      <ReviewsContainer
        productImg={product.mainImage}
        productName={product.name}
        reviews={reviews}
        hearts={hearts}
        isReviewFormOpen={isReviewFormOpen}
        openFormAddReview={toggleReviewForm}
        handleSubmitReview={handleSubmitReview}
      />
    </div>
  );
};


export default ProductDetailMobilePage;
