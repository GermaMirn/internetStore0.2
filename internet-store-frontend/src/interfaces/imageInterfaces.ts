export interface ImageModalProps {
  images: string[];
  currentIndex: number;
	created_at: string;
  user: string;
  text: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}


export interface ImagesCarouselProps {
  imagesUrl: string[];
  mainImage: string;
  onImageSelect: (imageUrl: string) => void;
}


export interface ProductImageProps {
  productId: number;
  imageUrl: string;
}


export interface ImageViewerProps {
  images: string[];
  onOpenModal: (index: number) => void;
}
