import { Comment } from ".";


export interface ReviewDataProps {
  isReview: boolean;
  user: string;
  created_at: string;
  text: string;
  mainImage?: string | null;
  imagesUrl?: string[];
  comments?: Comment[];
  showComments?: boolean;
  toggleComments?: () => void;
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
  reviews: Review[];
  hearts: number;
}


export interface ReviewItemProps extends Review {
  updateReviewLikes: (id: number, newLikes: number) => void;
  setIsLiked: (id: number, isLiked: boolean) => void;
}
