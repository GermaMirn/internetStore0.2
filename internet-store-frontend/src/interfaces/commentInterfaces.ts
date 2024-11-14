export interface Comment {
  id: number;
	reviewId: number;
  user: string;
  text: string;
  created_at: string;
  hearts: number;
	isLiked: boolean;
  imagesUrl: string[];
  mainImage: string | null;
	onNewComment?: (newComment: Comment) => void;
}
