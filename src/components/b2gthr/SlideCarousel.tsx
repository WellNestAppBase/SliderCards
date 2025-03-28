import React, { useState, useEffect, useCallback, ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";

interface SlideCarouselProps {
  children: ReactNode[];
  initialIndex?: number;
  pageTitles: string[];
  menuOpen?: boolean;
  setMenuOpen?: (open: boolean) => void;
  showMoodSelector?: boolean;
  urgentMode?: boolean;
  urgentPageIndex?: number;
}

const SlideCarousel: React.FC<SlideCarouselProps> = ({
  children,
  initialIndex = 4, // Default to Dashboard (index 4)
  pageTitles,
  menuOpen = false,
  setMenuOpen = () => {},
  showMoodSelector = false,
  urgentMode = false,
  urgentPageIndex,
}) => {
  const [currentPage, setCurrentPage] = useState(initialIndex);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: initialIndex,
    loop: false,
    align: "center",
    dragFree: false,
  });

  // Scroll to slide when currentPage changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(currentPage);
    }
  }, [currentPage, emblaApi]);

  // Navigate to urgent page when urgentMode is activated
  useEffect(() => {
    if (urgentMode && urgentPageIndex !== undefined && emblaApi) {
      setCurrentPage(urgentPageIndex);
      emblaApi.scrollTo(urgentPageIndex);
    }
  }, [urgentMode, urgentPageIndex, emblaApi]);

  // Update currentPage when embla scrolls
  const onSelect = useCallback(() => {
    if (emblaApi) {
      setCurrentPage(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", onSelect);
      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [emblaApi, onSelect]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        setCurrentPage((prev) => Math.min(pageTitles.length - 1, prev + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setCurrentPage((prev) => Math.max(0, prev - 1));
      } else if (e.key === "Home") {
        setCurrentPage(initialIndex); // Dashboard
      } else if (e.key === "End") {
        setCurrentPage(pageTitles.length - 1);
      }
      // Number key navigation removed
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pageTitles.length, initialIndex]);

  // Handle touch events for swiping
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50; // Minimum distance to register as a swipe
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swiped left, go to next page
        setCurrentPage((prev) => Math.min(pageTitles.length - 1, prev + 1));
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swiped right, go to previous page
        setCurrentPage((prev) => Math.max(0, prev - 1));
      }
    };

    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchend", handleTouchEnd, false);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pageTitles.length]);

  // Navigation Menu Component
  const NavigationMenu = () => (
    <motion.div
      className="fixed top-0 left-0 w-64 h-full bg-gray-900/90 backdrop-blur-sm border-r border-gray-800 z-50"
      initial={{ x: "-100%" }}
      animate={{ x: menuOpen ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Navigation</h3>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800/50"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="space-y-2">
          {pageTitles.map((title, idx) => (
            <li key={idx}>
              <button
                onClick={() => {
                  setCurrentPage(idx);
                  setMenuOpen(false);
                }}
                className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${currentPage === idx ? "bg-cyan-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );

  // Page indicator dots
  const PageIndicator = () => (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
      {pageTitles.map((_, idx) => (
        <button
          key={idx}
          onClick={() => setCurrentPage(idx)}
          className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentPage ? "bg-cyan-500 w-5" : "bg-gray-500/70 hover:bg-gray-400/70"}`}
          aria-label={`Go to page ${idx + 1}`}
        />
      ))}
    </div>
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-black/20">
      {/* Navigation Menu - Hidden but kept for structure */}
      <NavigationMenu />

      {/* Carousel Navigation Buttons */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
        className={`fixed left-3 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full transition-opacity ${currentPage === 0 ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
        disabled={currentPage === 0}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() =>
          setCurrentPage((prev) => Math.min(pageTitles.length - 1, prev + 1))
        }
        className={`fixed right-3 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full transition-opacity ${currentPage === pageTitles.length - 1 ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
        disabled={currentPage === pageTitles.length - 1}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Embla Carousel */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          <AnimatePresence initial={false} mode="wait">
            {React.Children.map(children, (child, index) => (
              <div
                className="flex-[0_0_100%] min-w-0 relative h-full"
                key={index}
              >
                {child}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Page indicator dots */}
      <PageIndicator />
    </div>
  );
};

export default SlideCarousel;
