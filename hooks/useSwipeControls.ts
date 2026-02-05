'use client';

import { useCallback, useState } from 'react';
import type { Direction } from '@/types/game';

const SWIPE_THRESHOLD = 50;

export function useSwipeControls(onSwipe: (direction: Direction) => void) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
          onSwipe(deltaX > 0 ? 'right' : 'left');
        }
      } else {
        if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
          onSwipe(deltaY > 0 ? 'down' : 'up');
        }
      }
      setTouchStart(null);
    },
    [touchStart, onSwipe]
  );

  return { handleTouchStart, handleTouchEnd };
}
