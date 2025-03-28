import React, { useState, useEffect, useRef } from "react";
import { DeeplySereneBackground } from "./DeeplySereneBackground";
import { CalmPeacefulBackground } from "./CalmPeacefulBackground";
import { MildNeutralBackground } from "./MildNeutralBackground";
import { SomethingOffBackground } from "./SomethingOffBackground";
import { HighAlertBackground } from "./HighAlertBackground";
import { UrgentBackground } from "./UrgentBackground";

export interface AnimatedBackgroundProps {
  className?: string;
  transitionProgress?: number;
  previousMoodIndex?: number;
}

export const TransitionBackground: React.FC<{
  currentMood: number;
  previousMood: number | null;
  transitionDuration?: number;
  className?: string;
}> = ({
  currentMood,
  previousMood,
  transitionDuration = 700,
  className = "",
}) => {
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedMood, setDisplayedMood] = useState(currentMood);
  const [prevMood, setPrevMood] = useState<number | null>(null);
  const animationRef = useRef<number | null>(null);

  // Cancel any ongoing animation when component unmounts
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (previousMood !== null && previousMood !== currentMood) {
      // Start transition
      setIsTransitioning(true);
      setPrevMood(previousMood);

      // Animate transition progress
      let startTime: number | null = null;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / transitionDuration, 1);

        setTransitionProgress(progress);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Transition complete
          setIsTransitioning(false);
          setDisplayedMood(currentMood);
          setPrevMood(null);
          animationRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      setDisplayedMood(currentMood);
    }
  }, [currentMood, previousMood, transitionDuration]);

  const CurrentBackground = getBackgroundByMood(displayedMood);
  const PreviousBackground =
    prevMood !== null ? getBackgroundByMood(prevMood) : null;

  // Calculate opacity classes for smooth transitions
  const currentOpacity = isTransitioning
    ? `opacity-${Math.round(transitionProgress * 100)}`
    : "opacity-100";

  const previousOpacity = `opacity-${Math.round((1 - transitionProgress) * 100)}`;

  return (
    <>
      {/* Base layer for additional depth */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      {/* Current mood background */}
      <CurrentBackground
        className={`${className} ${currentOpacity} transition-opacity duration-300`}
        transitionProgress={transitionProgress}
        previousMoodIndex={prevMood}
      />

      {/* Previous mood background during transition */}
      {isTransitioning && PreviousBackground && (
        <PreviousBackground
          className={`${className} ${previousOpacity} transition-opacity duration-300`}
          transitionProgress={1 - transitionProgress}
        />
      )}

      {/* Overlay gradient for enhanced visual effect */}
      <div
        className="absolute inset-0 pointer-events-none z-1 opacity-30 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${getMoodColor(currentMood)}40 0%, transparent 70%)`,
        }}
      ></div>
    </>
  );
};

// Helper function to get mood color by index
export const getMoodColor = (moodIndex: number): string => {
  switch (moodIndex) {
    case 0:
      return "#4f6a8f"; // Deeply Serene
    case 1:
      return "#88a2bc"; // Calm and Peaceful
    case 2:
      return "#8eb896"; // Mild/Neutral
    case 3:
      return "#fcc580"; // Something Feels Off
    case 4:
      return "#d9895f"; // High Alert
    case 5:
      return "#a24944"; // Urgent
    default:
      return "#8eb896"; // Default to Mild/Neutral
  }
};

export const getBackgroundByMood = (moodIndex: number) => {
  switch (moodIndex) {
    case 0: // Deeply Serene
      return DeeplySereneBackground;
    case 1: // Calm and Peaceful
      return CalmPeacefulBackground;
    case 2: // Mild/Neutral
      return MildNeutralBackground;
    case 3: // Something Feels Off
      return SomethingOffBackground;
    case 4: // High Alert
      return HighAlertBackground;
    case 5: // Urgent
      return UrgentBackground;
    default:
      return MildNeutralBackground;
  }
};

// Dynamic Background Component that automatically handles transitions
export const DynamicBackground: React.FC<{
  currentMood: number;
  className?: string;
}> = ({ currentMood, className = "" }) => {
  const [previousMood, setPreviousMood] = useState<number | null>(null);

  useEffect(() => {
    // When mood changes, store the previous mood for transition
    setPreviousMood((prev) => (prev !== currentMood ? prev : null));

    // Apply transition class to body for global effect
    document.body.classList.add("mood-transition");
    setTimeout(() => {
      document.body.classList.remove("mood-transition");
    }, 700);
  }, [currentMood]);

  return (
    <TransitionBackground
      currentMood={currentMood}
      previousMood={previousMood}
      className={className}
    />
  );
};

// Export all components individually
export {
  DeeplySereneBackground,
  CalmPeacefulBackground,
  MildNeutralBackground,
  SomethingOffBackground,
  HighAlertBackground,
  UrgentBackground,
};

// Create and export a default object with all components
const AnimatedBackgrounds = {
  DeeplySereneBackground,
  CalmPeacefulBackground,
  MildNeutralBackground,
  SomethingOffBackground,
  HighAlertBackground,
  UrgentBackground,
  getBackgroundByMood,
  getMoodColor,
  TransitionBackground,
  DynamicBackground,
};

export default AnimatedBackgrounds;
