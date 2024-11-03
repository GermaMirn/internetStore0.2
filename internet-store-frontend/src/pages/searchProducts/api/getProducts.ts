import axiosInstance from "../../../shared/api/axiosInstance";

interface Product {
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

interface SearchProductsResponse {
  page: number;
  total_pages: number;
  products: Product[];
}

export const fetchSearchProducts = async (page: number = 1): Promise<SearchProductsResponse> => {
  try {
    const response = await axiosInstance.get<SearchProductsResponse>(`/store/searchPageProducts/`, {
      params: { page }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
