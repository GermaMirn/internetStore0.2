export interface Comment {
  id: number;
  user: string;
  text: string;
  created_at: string;
  hearts: number;
	isLiked: boolean;
  imagesUrl: string[];
  mainImage: string | null;
}
