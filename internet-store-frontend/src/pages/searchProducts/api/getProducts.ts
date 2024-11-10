import axiosInstance from "../../../shared/api/axiosInstance";
import { SearchProductsResponse } from "../../../interfaces";

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
