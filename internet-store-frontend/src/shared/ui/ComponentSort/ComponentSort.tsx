import React, { useState } from 'react';
import styles from './ComponentSort.module.css';
import classNames from 'classnames';
import { Review } from '../../../pages/infoAboutProductDetail/ui/ReviewsContainer/Review/Review';
import SortIcon from './SortIcon';
import { sortReviews } from '../../../pages/infoAboutProductDetail/ui/ReviewsContainer/utils/sortReviews';


interface ComponentSortProps {
  reviews: Review[];
  onSortChange: (sortedReviews: Review[]) => void;
}


const ComponentSort: React.FC<ComponentSortProps> = ({ reviews, onSortChange }) => {
  const [currentSort, setCurrentSort] = useState<'date' | 'likes'>('date');
  const [isAscendingDate, setIsAscendingDate] = useState(true);
  const [isAscendingLikes, setIsAscendingLikes] = useState(true);

  const handleSortTypeChange = (type: 'date' | 'likes') => {
    if (type === 'date') {
      const newOrder = !isAscendingDate;
      setIsAscendingDate(newOrder);
      const sorted = sortReviews(reviews, 'date', newOrder);
      onSortChange(sorted);
    } else {
      const newOrder = !isAscendingLikes;
      setIsAscendingLikes(newOrder);
      const sorted = sortReviews(reviews, 'likes', newOrder);
      onSortChange(sorted);
    }
    setCurrentSort(type);
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
