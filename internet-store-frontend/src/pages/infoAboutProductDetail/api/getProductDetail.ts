import axiosInstance from "../../../shared/api/axiosInstance";

interface Product {
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

export const getProductDetail = async (productId: string): Promise<Product> => {
  try {
    const response = await axiosInstance.get(`/store/infoAboutproductDetail/${productId}/`);
    return response.data.product;
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw new Error('Failed to fetch product details');
  }
};
