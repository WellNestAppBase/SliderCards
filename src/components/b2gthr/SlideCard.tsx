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
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div
        className="card-content w-full mx-auto relative overflow-hidden flex flex-col bg-black/20 backdrop-blur-sm rounded-t-lg"
        style={{
          ...cardStyle,
          backgroundColor: `${moodOptions[currentMood].color}40`, // Add transparency to the background color
        }}
      >
        {/* Card Header - Swipe Area */}
        <div className="p-6 pb-2 border-b border-white/10">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        {/* Card Content */}
        <div className="flex-grow overflow-auto p-6 pt-4">{children}</div>

        {/* Card Footer - Mood Selector */}
        <div className="mt-auto">
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
