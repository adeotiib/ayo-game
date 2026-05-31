'use client';
import { useEffect } from 'react';
import { tryFullscreen, isTouchDevice } from './useFullscreen';

/**
 * On mobile: auto-request fullscreen whenever the device switches to landscape.
 * Also tries immediately if already landscape on mount.
 */
export function useAutoFullscreen() {
  useEffect(() => {
    if (!isTouchDevice()) return;

    const check = () => {
      // Small delay lets the browser finish rotating before we measure
      setTimeout(() => {
        const landscape = window.innerWidth > window.innerHeight;
        if (landscape) tryFullscreen();
      }, 250);
    };

    // Try immediately (works only if called from a gesture; on plain mount it will
    // usually be blocked — the orientation-change path is more reliable)
    check();

    window.addEventListener('orientationchange', check);
    screen.orientation?.addEventListener('change', check);

    return () => {
      window.removeEventListener('orientationchange', check);
      screen.orientation?.removeEventListener('change', check);
    };
  }, []);
}
