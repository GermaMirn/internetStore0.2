import axiosInstance from "../../../shared/api/axiosInstance";
import { ProductDetail } from "../../../interfaces";


export const getProductDetail = async (productId: string): Promise<ProductDetail> => {
  try {
    const response = await axiosInstance.get(`/store/infoAboutproductDetail/${productId}/`);
    return response.data.product;
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw new Error('Failed to fetch product details');
  }
};
