import axiosInstance from "../../../../shared/api/axiosInstance";


export const addReview = async (productId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.post(`/store/product/${productId}/review/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data.review;
  } catch (error) {
    console.error('Error while adding review:', error);
    throw new Error('Failed to add review');
  }
};
