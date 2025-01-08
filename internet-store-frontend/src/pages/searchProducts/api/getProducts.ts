import axiosInstance from "../../../shared/api/axiosInstance";
import { SearchProductsResponse } from "../../../interfaces";

export const fetchSearchProducts = async (page: number = 1, searchField?: string, categories?: string[]): Promise<SearchProductsResponse> => {
	try {
		const params: any = {
			page,
			searchInput: searchField || "",
		};

		if (categories && categories.length > 0) {
			params.tags = categories.join(',');
		}

		const response = await axiosInstance.get<SearchProductsResponse>('/store/searchPageProducts/', {
			params,
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching:', error);
		throw error;
	}
};
