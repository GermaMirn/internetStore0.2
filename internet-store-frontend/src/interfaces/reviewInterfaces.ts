import { Comment } from ".";


export interface ReviewDataProps {
  isReview: boolean;
  user: string;
  created_at: string;
  text: string;
	reviewId: number;
  mainImage?: string | null;
  imagesUrl?: string[];
  comments?: Comment[];
  showComments?: boolean;
  toggleComments?: () => void;
	onNewComment?: (newComment: Comment) => void;
}

export interface Review {
  id: number;
  user: string;
  text: string;
  created_at: string;
  hearts: number;
  isLiked: boolean;
  imagesUrl: string[];
  mainImage: string | null;
  comments: Comment[];
}


export interface ReviewsProps {
	productImg: string;
	productName: string;
  reviews: Review[];
  hearts: number;
	isReviewFormOpen: boolean;
	openFormAddReview: () => void;
	handleSubmitReview: (commentText: string, images: File[]) => void;
}


export interface ReviewItemProps extends Review {
  updateReviewLikes: (id: number, newLikes: number) => void;
  setIsLiked: (id: number, isLiked: boolean) => void;
}
