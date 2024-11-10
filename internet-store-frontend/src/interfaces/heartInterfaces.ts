export interface HeartProps {
  isCommentLiked?: boolean;
  commentId?: number;
  isReviewLiked?: boolean;
  reviewId?: number;
  heartsCount: number;
  onToggleLike?: (newLikedState: boolean, heartsCount: number) => Promise<void>;
}


export interface HeartProductProps {
  isProductLiked: boolean;
  productId: number;
  onToggleLike?: (newLikedState: boolean) => Promise<void>;
}
