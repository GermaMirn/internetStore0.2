import { CommentProps } from ".";


export interface ReviewDataProps {
  isReview: boolean;
  user: string;
  created_at: string;
  text: string;
	reviewId: number;
  mainImage?: string | null;
  imagesUrl?: string[];
  comments?: CommentProps[];
  showComments?: boolean;
  toggleComments?: () => void;
	onNewComment?: (newComment: CommentProps) => void;
}


export interface ReviewDataMobileProps {
  id: number;
  hearts: number;
  isLiked?: boolean;
  commentIsLiked?: boolean;
  isReview: boolean;
  user: string;
  created_at: string;
  text: string;
	reviewId: number;
  mainImage?: string | null;
  imagesUrl?: string[];
  comments?: CommentProps[];
  showComments?: boolean;
  toggleComments?: () => void;
	onNewComment?: (newComment: CommentProps) => void;
  handleLikeToggle?: () => void;
  setIsLiked?: (isLiked: boolean) => void;
}


export interface ReviewProps {
  id: number;
  user: string;
  text: string;
  created_at: string;
  hearts: number;
  isLiked: boolean;
  imagesUrl: string[];
  mainImage: string | null;
  comments: CommentProps[];
}


export interface ReviewsProps {
  productId?: number;
	productImg: string;
	productName: string;
  reviews: ReviewProps[];
  hearts: number;
	isReviewFormOpen: boolean;
	openFormAddReview: () => void;
	handleSubmitReview: (commentText: string, images: File[]) => void;
}


export interface ReviewItemProps extends ReviewProps {
  updateReviewLikes: (id: number, newLikes: number) => void;
  setIsLiked: (id: number, isLiked: boolean) => void;
}


export interface FormForSendNewReviewProps {
	productImg: string;
	productName: string;
  onClose: () => void;
	handleSubmitReview: (commentText: string, images: File[]) => void;
}


export interface getReviewsProps {
  reviews: ReviewProps[];
  productId: number;
}
