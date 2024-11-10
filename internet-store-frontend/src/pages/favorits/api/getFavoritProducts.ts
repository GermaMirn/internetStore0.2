import axiosInstance from "../../../shared/api/axiosInstance";
import { Product } from "../../../interfaces";


export const getLikedProducts = async (isLiked: boolean): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get('store/searchPageProducts/', {
      params: {
        isLiked,
      },
    });

    return response.data.products;
  } catch (error) {
    console.error('Error fetching liked products:', error);
    throw new Error('Failed to fetch liked products');
  }
};
