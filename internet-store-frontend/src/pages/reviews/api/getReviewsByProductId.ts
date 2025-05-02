import axiosInstance from "../../../shared/api/axiosInstance";
import { ReviewDataMobileProps } from "../../../interfaces";

export const getProductReviews = async (productId: string): Promise<ReviewDataMobileProps[]> => {
  try {
    const response = await axiosInstance.get(`/store/product/${productId}/reviews/`);

    return response.data.reviews;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw new Error('Failed to fetch product reviews');
  }
};
