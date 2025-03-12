import React, { useState } from 'react';
import styles from './OrderCardMobile.module.css';
import OrderDetail from '../OrderDetail';
import ProductImage from '../ProductImage';
import OrderStatus from '../../../../shared/ui/OrderStatus/OrderStatus';
import { OrderCardProps } from '../../../../interfaces';
import { baseURL } from '../../../../shared/api/axiosInstance';
import { useVisibleImages } from '../../hooks/useVisibleImages';
import { useMiniOrderCardMobile } from '../../hooks/useMiniOrderCardMobile';


const OrderCardMobile: React.FC<OrderCardProps> = ({ order }) => {
  const [showDetailsMobile, setShowDetails] = useState(false);
  const visibleCount = useVisibleImages();
  const miniCard = useMiniOrderCardMobile();

  const visibleImages = order.items.slice(0, visibleCount);
  const hiddenImages = order.items.slice(visibleCount);

  return (
    <div className={styles.orderCardMobile} onClick={() => setShowDetails(true)}>
      <div className={styles.orderCardHeaderMobile}>
        <div className={styles.nameAndStatusMobile}>
          <h2 className={styles.orderDate}>Заказ от {new Date(order.created_at).toLocaleDateString()}</h2>

          {miniCard ? (
            <div className={styles.orderCardDetailsMobile}>
              <p className={styles.orderIdMobile}>#{order.id}</p>
            </div>
          ) : (
						<div className={styles.statusMobile}>
          		<OrderStatus status={order.status} />
        		</div>
					)}
        </div>
      </div>

      {miniCard ? (
        <div className={styles.statusMobile}>
          <OrderStatus status={order.status} />
        </div>
      ) : (
				<div className={styles.orderCardDetailsMobile}>
					<p className={styles.orderIdMobile}>#{order.id}</p>
				</div>
      )}

      {order.items.length > 0 && (
        <div>
          <div className={styles.divForImgMobile}>
            <div className={styles.orderCardImagesMobile}>
              {visibleImages.map((item, index) => (
                <ProductImage
                  key={index}
                  productId={item.product.id}
                  imageUrl={baseURL + item.product.mainImageUrl}
                  isMobile={true}
                />
              ))}

              {hiddenImages.length > 0 && (
                <div>
                  <p
                    className={styles.moreImagesButtonMobile}
                    onClick={() => setShowDetails(true)}
                  >
                    См. ещё
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showDetailsMobile && (
        <OrderDetail
          order={order}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};


export default OrderCardMobile;
