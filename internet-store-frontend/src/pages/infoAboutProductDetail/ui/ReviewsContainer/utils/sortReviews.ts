import { Review } from '../Review/Review';


type SortType = 'date' | 'likes';


export const sortReviews = (
  reviews: Review[],
  sortBy: SortType,
  isAscending: boolean
): Review[] => {
  return [...reviews].sort((a, b) => {
    if (sortBy === 'date') {
      return isAscending
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return isAscending ? a.hearts - b.hearts : b.hearts - a.hearts;
    }
  });
};
