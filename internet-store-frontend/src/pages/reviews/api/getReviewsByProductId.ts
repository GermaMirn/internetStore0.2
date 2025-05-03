import axiosInstance from "../../../shared/api/axiosInstance";
import { getReviewsProps } from "../../../interfaces";

export const getProductReviews = async (productId: string): Promise<getReviewsProps> => {
  try {
    const response = await axiosInstance.get(`/store/product/${productId}/reviews/`);

    return response.data;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw new Error('Failed to fetch product reviews');
  }
};
