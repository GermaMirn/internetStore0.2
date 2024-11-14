import axiosInstance from "../../../../shared/api/axiosInstance";


export const addComment = async (reviewId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.post(`/store/review/${reviewId}/comment/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data.comment;
  } catch (error) {
    console.error('Error while adding comment:', error);
    throw new Error('Failed to add comment');
  }
};
