'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  GALLERY_HOVER_INTERVAL_MS,
  getNextGalleryImageIndex,
} from '../../utils/storeLogic';
import { ProductVisual } from '../visuals/ProductVisual';

export function useProductHoverGallery(images: string[]) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (images.length <= 1) return;
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    stopTimer();
    setIsHovering(true);
    // Start transitioning from image 1 (index 0) to image 2 (index 1) immediately
    setActiveIndex(1);

    timerRef.current = window.setInterval(() => {
      setActiveIndex((prev) => getNextGalleryImageIndex(prev, images.length));
    }, GALLERY_HOVER_INTERVAL_MS);
  }, [images.length, stopTimer]);

  const handleMouseLeave = useCallback(() => {
    stopTimer();
    setIsHovering(false);
    setActiveIndex(0);
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  const safeActiveIndex =
    activeIndex >= 0 && activeIndex < images.length ? activeIndex : 0;

  return {
    activeIndex: safeActiveIndex,
    isHovering,
    totalImages: images.length,
    handleMouseEnter,
    handleMouseLeave,
  };
}

interface ProductGalleryStageProps {
  images: string[];
  activeIndex: number;
  isHovering: boolean;
  productName: string;
  showCounterBadge?: boolean;
}

export const ProductGalleryStage: React.FC<ProductGalleryStageProps> = ({
  images,
  activeIndex,
  isHovering,
  productName,
  showCounterBadge = true,
}) => {
  const safeImages = images.length > 0 ? images : ['laptop-rog-front'];
  const safeIndex =
    activeIndex >= 0 && activeIndex < safeImages.length ? activeIndex : 0;

  return (
    <div
      data-testid="product-gallery-stage"
      data-active-index={safeIndex}
      data-gallery-count={safeImages.length}
      data-hovering={isHovering ? 'true' : 'false'}
      className="relative w-full h-full overflow-hidden"
    >
      {safeImages.map((visualKey, idx) => {
        const isActive = idx === safeIndex;
        return (
          <div
            key={`${visualKey}-${idx}`}
            data-testid={`gallery-slide-${idx}`}
            data-active={isActive ? 'true' : 'false'}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
              isActive
                ? 'opacity-100 z-10'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <ProductVisual
              visualKey={visualKey}
              alt={idx === 0 ? productName : `${productName} - ${idx + 1}`}
            />
          </div>
        );
      })}

      {/* Subtle multi-image counter & progress dots on hover */}
      {showCounterBadge && safeImages.length > 1 && (
        <>
          <div
            className={`absolute bottom-2 start-2 z-20 flex items-center gap-1 px-1.5 py-1 rounded-xs bg-[#111318]/75 pointer-events-none transition-opacity duration-200 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          >
            {safeImages.map((_, idx) => (
              <span
                key={idx}
                className={`h-1 rounded-full transition-all duration-200 ${
                  idx === safeIndex
                    ? 'w-3 bg-[#EF875D]'
                    : 'w-1 bg-white/45'
                }`}
              />
            ))}
          </div>

          <span
            data-testid="product-gallery-counter"
            className={`absolute bottom-2 end-2 z-20 bg-[#111318]/85 text-white text-[10px] font-mono-num font-semibold px-1.5 py-0.5 rounded-xs pointer-events-none transition-opacity duration-200 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {safeIndex + 1}/{safeImages.length}
          </span>
        </>
      )}
    </div>
  );
};
