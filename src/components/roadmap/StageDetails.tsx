import React, { useRef, useEffect, useState, useCallback } from "react";
import { RoadmapStage } from "./GameBoard";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StageDetailsProps {
  roadmapStages: RoadmapStage[];
  currentStageIndex: number;
  gamePosition: any; // framer-motion useTransform return type
  onStageChange?: (index: number) => void;
}

const StageDetails: React.FC<StageDetailsProps> = ({
  roadmapStages,
  currentStageIndex,
  gamePosition,
  onStageChange,
}) => {
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  // Initialize Embla Carousel with improved options and disabled scrolling
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    dragFree: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
    draggable: false, // Disable dragging
    skipSnaps: false, // Prevent skipping snaps
    axis: "x", // Only allow horizontal scrolling
  });

  // Scroll to current stage when it changes
  useEffect(() => {
    if (emblaApi && currentStageIndex >= 0) {
      emblaApi.scrollTo(currentStageIndex);
    }
  }, [currentStageIndex, emblaApi]);

  // Handle slide change and notify parent component
  useEffect(() => {
    if (!emblaApi || !onStageChange) return;

    const onSelect = () => {
      const selectedIndex = emblaApi.selectedScrollSnap();
      if (selectedIndex !== currentStageIndex) {
        onStageChange(selectedIndex);
      }

      // Update button states
      setPrevBtnEnabled(emblaApi.canScrollPrev());
      setNextBtnEnabled(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    // Initial button state
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());

    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, currentStageIndex, onStageChange]);

  // Scroll prev and next
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  // Completely disable all automatic scrolling
  useEffect(() => {
    // Disable Embla's scroll detection completely
    if (emblaApi) {
      emblaApi.reInit({
        ...emblaApi.options,
        draggable: false,
        watchDrag: false,
        watchResize: false,
        watchScroll: false,
      });
    }

    // Handle only left/right arrow keys for manual navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (e.key === "ArrowLeft" && emblaApi?.canScrollPrev()) {
          emblaApi.scrollPrev();
        } else if (e.key === "ArrowRight" && emblaApi?.canScrollNext()) {
          emblaApi.scrollNext();
        }
      }
    };

    // Only add keyboard listener for left/right arrows
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [emblaApi]);

  // Individual stage card component
  const StageCard = ({
    stage,
    index,
  }: {
    stage: RoadmapStage;
    index: number;
  }) => {
    const isCurrentStage = index === currentStageIndex;
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div
        className={cn(
          "flex-shrink-0 min-w-[300px] w-full max-w-[500px] mx-3 bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300",
          isCurrentStage
            ? "border-purple-500/50 shadow-xl shadow-purple-500/20 scale-105"
            : "border-gray-800",
          isExpanded ? "h-auto" : "h-auto",
        )}
      >
        <div className="p-6">
          {/* Stage header with mood color */}
          <div className="flex items-center mb-4">
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center mr-4 text-2xl flex-shrink-0 transition-transform",
                isCurrentStage && "scale-110 shadow-lg",
              )}
              style={{ backgroundColor: stage.moodColor }}
            >
              {stage.icon || "🔍"}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-400 truncate">
                Stage {stage.stage}
              </div>
              <h3 className="text-xl font-bold truncate">{stage.name}</h3>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-4 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Timeline</div>
            <p className="text-white font-medium text-sm">{stage.duration}</p>
          </div>

          {/* Mood indicator */}
          <div className="mb-4 flex items-center">
            <div className="text-sm text-gray-400 mr-3 flex-shrink-0">
              Mood:
            </div>
            <div className="flex items-center overflow-hidden">
              <div
                className="w-4 h-4 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: stage.moodColor }}
              ></div>
              <span className="text-sm truncate">
                {index === 0 || index === 7
                  ? "Deeply Serene"
                  : index === 1
                    ? "Calm and Peaceful"
                    : index === 2
                      ? "Mild/Neutral"
                      : index === 3
                        ? "Something Feels Off"
                        : index === 4
                          ? "High Alert"
                          : "Urgent"}
              </span>
            </div>
          </div>

          {/* Details */}
          <div
            className={cn(
              "bg-black/20 p-4 rounded-lg border border-gray-800 mb-4 cursor-pointer transition-all",
              isExpanded && "ring-1 ring-purple-500/30",
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-base font-semibold flex items-center">
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 w-6 h-1 mr-2"></span>
                Details
              </h4>
              <div className="text-xs text-gray-400">
                {isExpanded ? "Click to collapse" : "Click to expand"}
              </div>
            </div>
            <p
              className={cn(
                "text-gray-300 text-sm transition-all",
                isExpanded ? "line-clamp-none" : "line-clamp-3",
              )}
            >
              {stage.details}
            </p>
          </div>

          {/* Key Actions */}
          <div className="bg-black/20 p-4 rounded-lg border border-gray-800 mb-4">
            <h4 className="text-base font-semibold mb-3 flex items-center">
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 w-6 h-1 mr-2"></span>
              Key Actions
            </h4>
            <ul className="space-y-2">
              {stage.keyActions.map((action, i) => (
                <li key={i} className="flex items-start">
                  <div className="mr-2 mt-1 text-pink-400 text-sm">•</div>
                  <p className="text-white text-sm line-clamp-2">{action}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                index < currentStageIndex
                  ? "bg-green-900/30 text-green-400"
                  : index === currentStageIndex
                    ? "bg-blue-900/30 text-blue-400"
                    : "bg-gray-800/50 text-gray-400",
              )}
            >
              {index < currentStageIndex
                ? "Completed"
                : index === currentStageIndex
                  ? "In Progress"
                  : "Upcoming"}
            </div>

            {/* Progress indicator for current stage */}
            {isCurrentStage && (
              <div className="text-xs text-gray-400">
                {Math.round(gamePosition.get() * 100) % 100}% Complete
              </div>
            )}
          </div>

          {/* Progress bar for current stage */}
          {isCurrentStage && (
            <div className="mt-3 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                style={{
                  width: `${Math.round(gamePosition.get() * 100) % 100}%`,
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.round(gamePosition.get() * 100) % 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Navigation dots component with tooltips
  const NavigationDots = () => (
    <div className="flex justify-center mt-6 space-x-3">
      {roadmapStages.map((stage, index) => (
        <div key={index} className="relative group">
          <button
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "w-4 h-4 rounded-full transition-all duration-300",
              index === currentStageIndex
                ? "bg-purple-500 scale-125 ring-2 ring-purple-300/30"
                : "bg-gray-600 hover:bg-gray-500 hover:scale-110",
              hoveredDot === index && "ring-2 ring-white/30",
            )}
            aria-label={`Go to stage ${index + 1}`}
            onMouseEnter={() => setHoveredDot(index)}
            onMouseLeave={() => setHoveredDot(null)}
          />

          {/* Tooltip */}
          {hoveredDot === index && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
              {stage.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Carousel navigation buttons */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          className={cn(
            "p-2 rounded-full bg-gray-800/70 backdrop-blur-sm transition-all",
            prevBtnEnabled
              ? "hover:bg-purple-900/70 text-white"
              : "text-gray-600 cursor-not-allowed",
          )}
          aria-label="Previous stage"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-sm text-gray-400">
          Stage {currentStageIndex + 1} of {roadmapStages.length}
        </div>

        <button
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          className={cn(
            "p-2 rounded-full bg-gray-800/70 backdrop-blur-sm transition-all",
            nextBtnEnabled
              ? "hover:bg-purple-900/70 text-white"
              : "text-gray-600 cursor-not-allowed",
          )}
          aria-label="Next stage"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Main carousel */}
      <div className="relative">
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex py-4">
            {/* Stage detail cards */}
            {roadmapStages.map((stage, index) => (
              <StageCard key={index} stage={stage} index={index} />
            ))}
          </div>
        </div>

        {/* Gradient overlays to indicate more content */}
        <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-gray-900/80 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-gray-900/80 to-transparent pointer-events-none"></div>
      </div>

      <NavigationDots />

      {/* Enhanced hopscotch navigation */}
      <div className="relative h-20 mt-8 mx-auto max-w-3xl">
        {/* Path connecting the hopscotch points */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 transform -translate-y-1/2 rounded-full"></div>

        {/* Completed path */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 transform -translate-y-1/2 rounded-full transition-all duration-300"
          style={{
            width: `${(currentStageIndex / (roadmapStages.length - 1)) * 100}%`,
          }}
        ></div>

        <div className="absolute inset-0 flex items-center justify-between">
          {roadmapStages.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isUpcoming = index > currentStageIndex;

            return (
              <div key={index} className="relative group">
                <button
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={cn(
                    "w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 z-10 relative",
                    isCompleted
                      ? "border-green-500 bg-green-900/30 text-green-400"
                      : isCurrent
                        ? "border-purple-500 bg-purple-900/30 text-white ring-4 ring-purple-500/20"
                        : "border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-700/50",
                  )}
                  aria-label={`Go to stage ${index + 1}`}
                >
                  {stage.icon || index + 1}
                </button>

                {/* Stage name tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">
                  {stage.name}
                </div>

                {/* Status indicator */}
                <div
                  className={cn(
                    "absolute -top-2 -right-2 w-4 h-4 rounded-full border",
                    isCompleted
                      ? "bg-green-500 border-green-400"
                      : isCurrent
                        ? "bg-blue-500 border-blue-400"
                        : "bg-gray-600 border-gray-500",
                  )}
                ></div>
              </div>
            );
          })}

          {/* Animated game piece that moves along the hopscotch */}
          <motion.div
            className="absolute w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full z-20 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-500/30"
            style={{
              left: `calc(${(currentStageIndex / (roadmapStages.length - 1)) * 100}% - 16px)`,
              top: "50%",
              y: "-50%",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            B2G
          </motion.div>
        </div>
      </div>

      {/* Keyboard navigation hint removed as navigation is now button-only */}
    </div>
  );
};

export default StageDetails;
