import { useState, useEffect } from 'react';


export const useVisibleImages = (): number => {
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;

			if (width <= 430) {
				setVisibleCount(2);
			} else if (width > 430 && width <= 540) {
				setVisibleCount(3);
			} else if (width > 540 && width <= 600) {
				setVisibleCount(4);
			} else if (width > 600 && width <= 910) {
				setVisibleCount(5);
			} else if (width > 910 && width <= 1080) {
				setVisibleCount(3);
			} else if (width > 1080 && width <= 1190) {
				setVisibleCount(4);
			} else if (width > 1190) {
				setVisibleCount(5);
			}
    };

    window.addEventListener('resize', updateVisibleCount);

    updateVisibleCount();

    return () => {
      window.removeEventListener('resize', updateVisibleCount);
    };
  }, []);

  return visibleCount;
};
