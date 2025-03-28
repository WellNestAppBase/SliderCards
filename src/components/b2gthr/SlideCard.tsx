import React, { ReactNode } from "react";
import MoodSelector, { MoodOption } from "./MoodSelector";

interface SlideCardProps {
  title: string;
  children: ReactNode;
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit?: (context: string) => void;
  cardStyle?: React.CSSProperties;
}

const SlideCard: React.FC<SlideCardProps> = ({
  title,
  children,
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit = () => {},
  cardStyle = {},
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-5">
      <div
        className="card-content w-full mx-auto relative overflow-hidden flex flex-col bg-black/30 backdrop-blur-md rounded-t-lg shadow-xl"
        style={{
          ...cardStyle,
          backgroundColor: `${moodOptions[currentMood].color}40`, // Add transparency to the background color
          boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 0 15px ${moodOptions[currentMood].color}30`,
          borderLeft: `1px solid ${moodOptions[currentMood].color}30`,
          borderTop: `1px solid ${moodOptions[currentMood].color}30`,
          borderRight: `1px solid ${moodOptions[currentMood].color}20`,
          borderBottom: `1px solid ${moodOptions[currentMood].color}10`,
        }}
      >
        {/* Card Header - Swipe Area */}
        <div className="relative py-7 border-b border-white/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-80"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/10 to-white/0 blur-sm"></div>
          <h2 className="text-2xl font-bold text-center relative z-10 tracking-wide">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white/90 via-white to-white/90 px-2 py-1 rounded">
              {title}
            </span>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-3"></div>
          </h2>
        </div>

        {/* Card Content */}
        <div className="flex-grow overflow-auto p-6 pt-5 px-7">{children}</div>

        {/* Card Footer - Mood Selector */}
        <div className="mt-auto pt-2 border-t border-white/10">
          <MoodSelector
            currentMood={currentMood}
            setCurrentMood={setCurrentMood}
            moodOptions={moodOptions}
            showContextPrompt={true}
            onContextSubmit={onContextSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default SlideCard;
