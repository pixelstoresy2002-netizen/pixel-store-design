import React from 'react';

interface PixelLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Renders the authoritative Pixel Store logo using the official brand asset
 * (/assets/aistudio/image_c2b79728.png on light surfaces, /assets/aistudio/image_92b9c716.png or vector on dark).
 */
export const PixelLogo: React.FC<PixelLogoProps> = ({
  variant = 'light',
  size = 'md',
  className = '',
}) => {
  const heightClass =
    size === 'sm' ? 'h-8' : size === 'lg' ? 'h-14' : 'h-10';

  if (variant === 'light') {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src="/assets/aistudio/image_c2b79728.png"
          alt="PIXEL STORE"
          referrerPolicy="no-referrer"
          className={`${heightClass} w-auto object-contain mix-blend-multiply`}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`} dir="ltr">
      <svg
        viewBox="0 0 280 95"
        dir="ltr"
        className={`${heightClass} w-auto`}
        aria-label="PIXEL STORE"
        role="img"
      >
        <defs>
          <linearGradient id="pixelBrandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8E4DEB" />
            <stop offset="50%" stopColor="#D66C9D" />
            <stop offset="100%" stopColor="#EF875D" />
          </linearGradient>
        </defs>
        {/* Pixel 4-Point Star on top-left */}
        <path
          d="M24 4h4v8h4v6h6v4h8v4h-8v4h-6v6h-4v8h-4v-8h-4v-6h-6v-4H6v-4h8v-4h6v-6h4V4z"
          fill="#8E4DEB"
        />
        {/* PIXEL Bold Pixel Wordmark with dark offset stroke */}
        <text
          x="44"
          y="60"
          fontFamily="'Silkscreen', monospace"
          fontWeight="700"
          fontSize="48"
          fill="#07080C"
          stroke="#07080C"
          strokeWidth="6"
          letterSpacing="2"
        >
          PIXEL
        </text>
        <text
          x="41"
          y="57"
          fontFamily="'Silkscreen', monospace"
          fontWeight="700"
          fontSize="48"
          fill="url(#pixelBrandGrad)"
          stroke="#232530"
          strokeWidth="2"
          letterSpacing="2"
        >
          PIXEL
        </text>
        {/* STORE Pink Sub-wordmark */}
        <text
          x="166"
          y="84"
          fontFamily="'Silkscreen', monospace"
          fontWeight="700"
          fontSize="21"
          fill="#07080C"
          stroke="#07080C"
          strokeWidth="4"
          letterSpacing="1.5"
        >
          STORE
        </text>
        <text
          x="164"
          y="82"
          fontFamily="'Silkscreen', monospace"
          fontWeight="700"
          fontSize="21"
          fill="#D66C9D"
          letterSpacing="1.5"
        >
          STORE
        </text>
      </svg>
    </div>
  );
};
