'use client';
import { useState, useEffect, useCallback } from 'react';

/** Call synchronously from a user-gesture handler (click/tap). */
export function tryFullscreen() {
  const el = document.documentElement as any;
  const active = document.fullscreenElement || (document as any).webkitFullscreenElement;
  if (active) return;
  try { el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.(); } catch { /* ignore */ }
}

export function isTouchDevice() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
}

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
