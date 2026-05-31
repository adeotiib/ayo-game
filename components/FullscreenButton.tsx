'use client';

interface Props {
  isFullscreen: boolean;
  onToggle: () => void;
  className?: string;
}

export function FullscreenButton({ isFullscreen, onToggle, className = '' }: Props) {
  return (
    <button
      onClick={onToggle}
      title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      className={`${className}
        min-w-[44px] min-h-[44px] flex items-center justify-center
        text-amber-700 border border-amber-800/40 rounded-lg
        bg-black/30 hover:bg-amber-900/40 hover:text-amber-400
        active:scale-95 transition-all`}
    >
      {isFullscreen ? <CompressIcon /> : <ExpandIcon />}
    </button>
  );
}

function ExpandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {/* top-left corner */}
      <path d="M1 7V1h6" />
      {/* top-right corner */}
      <path d="M17 7V1h-6" />
      {/* bottom-left corner */}
      <path d="M1 11v6h6" />
      {/* bottom-right corner */}
      <path d="M17 11v6h-6" />
    </svg>
  );
}

function CompressIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {/* top-left corner pointing inward */}
      <path d="M7 1v6H1" />
      {/* top-right corner pointing inward */}
      <path d="M11 1v6h6" />
      {/* bottom-left corner pointing inward */}
      <path d="M7 17v-6H1" />
      {/* bottom-right corner pointing inward */}
      <path d="M11 17v-6h6" />
    </svg>
  );
}
