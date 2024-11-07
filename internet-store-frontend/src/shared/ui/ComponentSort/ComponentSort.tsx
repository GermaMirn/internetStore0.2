import React from 'react';
import styles from './ComponentSort.module.css';
import classNames from 'classnames';
import { Review } from '../../../pages/infoAboutProductDetail/ui/ReviewsContainer/Review/Review';
import SortIcon from './SortIcon';
import { sortReviews } from '../../../pages/infoAboutProductDetail/ui/ReviewsContainer/utils/sortReviews';



interface ComponentSortProps {
  reviews: Review[];
  onSortChange: (sortedReviews: Review[]) => void;
  currentSort: 'date' | 'likes';
  isAscendingDate: boolean;
  isAscendingLikes: boolean;
  setCurrentSort: (sort: 'date' | 'likes') => void;
  setIsAscendingDate: (isAscending: boolean) => void;
  setIsAscendingLikes: (isAscending: boolean) => void;
}


const ComponentSort: React.FC<ComponentSortProps> = ({
  reviews,
  onSortChange,
  currentSort,
  isAscendingDate,
  isAscendingLikes,
  setCurrentSort,
  setIsAscendingDate,
  setIsAscendingLikes,
}) => {
  const handleSortTypeChange = (type: 'date' | 'likes') => {
    let newOrder;

    if (type === 'date') {
      newOrder = !isAscendingDate;
      setIsAscendingDate(newOrder);
      setCurrentSort('date');
    } else {
      newOrder = !isAscendingLikes;
      setIsAscendingLikes(newOrder);
      setCurrentSort('likes');
    }

    const sorted = sortReviews(reviews, type, newOrder);
    onSortChange(sorted);
  };

  return (
    <div className={styles.sortDiv}>
      <h5 className={classNames(styles.sortText, styles.underline)} onClick={() => handleSortTypeChange('date')}>
        Дате
      </h5>
      <SortIcon isAscending={isAscendingDate} onClick={() => handleSortTypeChange('date')} active={currentSort === 'date'} />

      <h5 className={classNames(styles.sortText, styles.underline)} onClick={() => handleSortTypeChange('likes')}>
        Количеству лайков
      </h5>
      <SortIcon isAscending={isAscendingLikes} onClick={() => handleSortTypeChange('likes')} active={currentSort === 'likes'} />
    </div>
  );
};


export default ComponentSort;
