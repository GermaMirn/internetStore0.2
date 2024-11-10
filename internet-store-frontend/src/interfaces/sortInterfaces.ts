import { Review } from ".";


export interface ComponentSortProps {
  reviews: Review[];
  onSortChange: (sortedReviews: Review[]) => void;
  currentSort: 'date' | 'likes';
  isAscendingDate: boolean;
  isAscendingLikes: boolean;
  setCurrentSort: (sort: 'date' | 'likes') => void;
  setIsAscendingDate: (isAscending: boolean) => void;
  setIsAscendingLikes: (isAscending: boolean) => void;
}


export interface SortIconProps {
  isAscending: boolean;
  onClick: () => void;
  active: boolean;
}
