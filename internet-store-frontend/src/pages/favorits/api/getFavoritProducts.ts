import axiosInstance from "../../../shared/api/axiosInstance";


export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  categories: string[];
  imagesURL: string[];
  mainImageUrl: string;
  hearts: number;
  isHearted: boolean;
  isInCart: boolean;
  cartQuantity: number;
  cartItemId: number;
}


export const getLikedProducts = async (isLiked: boolean): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get('store/searchPageProducts/', {
      params: {
        isLiked,
      },
    });
		console.log(response.data)
    return response.data.products;
  } catch (error) {
    console.error('Error fetching liked products:', error);
    throw new Error('Failed to fetch liked products');
  }
};
