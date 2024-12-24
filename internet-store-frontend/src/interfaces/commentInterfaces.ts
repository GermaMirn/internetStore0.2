import { EditorState } from 'draft-js';


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


export interface CommentActionsProps {
  commentsCount: number;
  showComments: boolean;
  isReplyFormOpen: boolean;
  token: string | null;
	isReview?: boolean;
	onToggleComments: () => void;
	onReplyClick: () => void;
}


export interface FormForSendNewCommentReviewProps {
  onClose: () => void;
  onSubmit: (commentText: string, images: File[]) => void;
  isReplyToComment?: boolean;
  username?: string;
  isReview?: boolean;
}


export interface UsernameEditorProps {
  editorState: EditorState;
  onChange: (editorState: EditorState) => void;
}
