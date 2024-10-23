import axios from 'axios';

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
}

interface SearchProductsResponse {
  page: number;
  total_pages: number;
  products: Product[];
}

export const fetchSearchProducts = async (page: number = 1): Promise<SearchProductsResponse> => {
  try {
    const response = await axios.get<SearchProductsResponse>(`http://127.0.0.1:8000/api/store/searchPageProducts/`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
