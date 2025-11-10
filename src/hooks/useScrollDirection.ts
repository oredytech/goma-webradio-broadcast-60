import { useState, useEffect } from 'react';

interface ScrollState {
  isScrollingDown: boolean;
  isAtTop: boolean;
  scrollY: number;
}

export const useScrollDirection = (threshold = 100) => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    isScrollingDown: false,
    isAtTop: true,
    scrollY: 0,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollState = () => {
      const scrollY = window.scrollY;
      const isAtTop = scrollY < 10;
      const isScrollingDown = scrollY > lastScrollY && scrollY > threshold;

      setScrollState({
        isScrollingDown,
        isAtTop,
        scrollY,
      });

      lastScrollY = scrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrollState;
};
