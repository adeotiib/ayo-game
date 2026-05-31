'use client';
import { useState, useEffect, useCallback } from 'react';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(
        !!(document.fullscreenElement || (document as any).webkitFullscreenElement),
      );
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, []);

  const toggle = useCallback(async () => {
    try {
      const el = document.documentElement as any;
      const fsEl = (document as any).fullscreenElement ?? (document as any).webkitFullscreenElement;
      if (!fsEl) {
        await (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.());
      } else {
        await (document.exitFullscreen?.() ?? (document as any).webkitExitFullscreen?.());
      }
    } catch {
      // Fullscreen not supported (iOS Safari) — silently ignore
    }
  }, []);

  const supported =
    typeof document !== 'undefined' &&
    !!(
      (document.documentElement as any).requestFullscreen ||
      (document.documentElement as any).webkitRequestFullscreen
    );

  return { isFullscreen, toggle, supported };
}
