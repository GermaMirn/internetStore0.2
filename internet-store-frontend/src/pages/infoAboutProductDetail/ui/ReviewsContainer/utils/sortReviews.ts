import { Review } from '../Review/Review';


type SortType = 'date' | 'likes';


export const sortReviews = (reviews: Review[], sortBy: SortType, isAscending: boolean): Review[] => {
	const sorted = [...reviews].sort((a, b) => {
		let comparison = 0;

		if (sortBy === 'likes') {
			const heartsA = a.hearts || 0;
			const heartsB = b.hearts || 0;
			comparison = heartsA - heartsB;
		}

		if (comparison === 0) {
			const dateA = new Date(a.created_at).getTime();
			const dateB = new Date(b.created_at).getTime();
			comparison = dateA - dateB;
		}

		return isAscending ? comparison : -comparison;
	});

	return sorted;
};
