import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia("(max-width: 910px)").matches;
    }
    return false;
  });

  const handleResize = () => {
		const matches = window.matchMedia("(max-width: 910px)").matches;
		setIsMobile(matches);
	};

  useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

  return isMobile;
};
