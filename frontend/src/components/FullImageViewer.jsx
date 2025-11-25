import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md';

export default function FullImageViewer({ images, initialIndex = 0, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const touchStartDistance = useRef(0);
  const lastTouchDistance = useRef(0);

  // Reset state when modal opens or image changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  // Reset zoom when changing images
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        prevImage();
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Mouse wheel zoom (desktop)
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(1, scale + delta), 4);
    setScale(newScale);
    
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Touch gestures for pinch-to-zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch zoom start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      touchStartDistance.current = distance;
      lastTouchDistance.current = distance;
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan start when zoomed
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const scaleDelta = distance / lastTouchDistance.current;
      const newScale = Math.min(Math.max(1, scale * scaleDelta), 4);
      setScale(newScale);
      lastTouchDistance.current = distance;
      
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Pan when zoomed
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      touchStartDistance.current = 0;
      lastTouchDistance.current = 0;
    }
    if (e.touches.length === 0) {
      setIsDragging(false);
    }
  };

  // Mouse drag for panning when zoomed
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Swipe detection for mobile navigation
  const swipeThreshold = 50;
  const [swipeStart, setSwipeStart] = useState(null);

  const handleSwipeStart = (e) => {
    if (scale === 1 && images.length > 1) {
      setSwipeStart(e.touches[0].clientX);
    }
  };

  const handleSwipeEnd = (e) => {
    if (swipeStart !== null && scale === 1 && images.length > 1) {
      const swipeEnd = e.changedTouches[0].clientX;
      const diff = swipeStart - swipeEnd;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextImage();
        } else {
          prevImage();
        }
      }
      setSwipeStart(null);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && scale === 1) {
      onClose();
    }
  };

  if (!isOpen || !images || images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center"
          onClick={handleBackdropClick}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          ref={containerRef}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all duration-200"
            aria-label="Close full-screen viewer"
          >
            <MdClose className="w-7 h-7 text-white" />
          </button>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && scale === 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all duration-200 hidden sm:block"
                aria-label="Previous image"
              >
                <MdChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all duration-200 hidden sm:block"
                aria-label="Next image"
              >
                <MdChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}

          {/* Zoom Indicator */}
          {scale > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
              {Math.round(scale * 100)}%
            </div>
          )}

          {/* Image Container */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full flex items-center justify-center p-4"
            onTouchStart={(e) => {
              handleTouchStart(e);
              handleSwipeStart(e);
            }}
            onTouchMove={handleTouchMove}
            onTouchEnd={(e) => {
              handleTouchEnd(e);
              handleSwipeEnd(e);
            }}
          >
            <motion.img
              ref={imageRef}
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className={`max-w-full max-h-full object-contain select-none ${
                scale > 1 ? 'cursor-move' : 'cursor-zoom-in'
              }`}
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
              onMouseDown={handleMouseDown}
              onClick={(e) => {
                e.stopPropagation();
                if (scale === 1) {
                  setScale(2);
                } else {
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                }
              }}
              draggable={false}
            />
          </motion.div>

          {/* Instructions */}
          <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs max-w-xs hidden sm:block">
            <p className="font-semibold mb-1">Controls:</p>
            <p>• Scroll to zoom • Click image to toggle zoom</p>
            <p>• Drag to pan when zoomed • Arrow keys to navigate</p>
            <p>• Esc to close</p>
          </div>

          {/* Mobile Instructions */}
          {scale === 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs sm:hidden">
              <p>Pinch to zoom • Swipe to navigate • Tap to zoom</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
