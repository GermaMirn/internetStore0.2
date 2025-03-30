import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductDetail } from '../api/getProductDetail';
import { ProductDetail } from '../../../interfaces';
import { addReview } from '../api/addCommentReview/addReview';
import ReviewsContainer from '../../../entities/ReviewsContainer/ReviewsContainer';
import styles from './ProductDetailMobile.module.css';
import { useErrorRedirect } from '../../../hooks/errorHandler';
import ImagesCarouselMobile from '../../../entities/ImagesCarouselReviewComment/ui/ImagesCarouselReviewCommentMobile';
import ProductCategories from '../../../shared/ui/ProductCategories/ProductCategories';
import EmptyPageText from '../../../shared/ui/EmptyPageText/EmptyPageText';
import Heart from '../../../shared/ui/Heart/Heart';
import ReturnArrow from '../../../shared/ui/ReturnArrow/ReturnArrow';
import ProductMobileActionButtonCart from '../../../entities/product/ui/ProductMobileActionButtonCart';
import ProductDescriptionMobile from '../../../entities/ProductDescriptionMobile/ProductDescriptionMobile';


const ProductDetailMobilePage = () => {
  const { id } = useParams<{ id?: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviews, setReviews] = useState(product?.reviews || []);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [hearts, setHearts] = useState<number>(0);
  const [isHearted, setIsHearted] = useState<boolean>(false);
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
          setIsHearted(fetchedProduct.isHearted)
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

  const handleToggleHeart = async () => {
    return new Promise<void>((resolve) => {
      setIsHearted(prev => !prev);
      setHearts(hearts + (isHearted ? -1 : 1));
      resolve();
    });
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
        <div className={styles.mainImage}>
          <div className={styles.returnArrowAndHeart}>
            <ReturnArrow arrowSrc={'/product/returnArrow.svg'} />

            <Heart productId={product.id} isProductLiked={isHearted} onToggleLike={handleToggleHeart} />
          </div>

          <div className={styles.imgOfProductDetail}>
            <ImagesCarouselMobile
              imagesUrl={product.imagesUrl}
              mainImage={product.mainImage}
              onImageSelect={setCurrentImage}
            />
          </div>
        </div>

        <div className={styles.infoProductDetail}>
          <div className={styles.nameProductDetail}>
            <p className={styles.productName}>{product.name}</p>
            <p className={styles.productPrice}>{product.price}</p>
          </div>

          <div className={styles.categories}>
            <ProductCategories categories={product.categories} />
          </div>

          <ProductDescriptionMobile description={product.description} />
        </div>
      </div>

      <ReviewsContainer
        productImg={currentImage || product.mainImage}
        productName={product.name}
        reviews={reviews}
        hearts={hearts}
        isReviewFormOpen={isReviewFormOpen}
        openFormAddReview={toggleReviewForm}
        handleSubmitReview={handleSubmitReview}
      />

      <ProductMobileActionButtonCart
        productId={product.id}
        isInCart={product.isInCart}
        cartQuantity={product.cartQuantity}
        cartItemId={product.cartItemId}
        updateCartState={updateCartState}
      />
    </div>
  );
};


export default ProductDetailMobilePage;
