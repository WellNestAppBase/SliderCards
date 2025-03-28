import React from "react";
import { MoodOption } from "../MoodSelector";

interface UrgentHelpProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit: (context: string) => void;
  cardStyle?: React.CSSProperties;
}

const UrgentHelp: React.FC<UrgentHelpProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit,
  cardStyle = {},
}) => {
  return (
    <div
      className="flex flex-col h-full w-full p-6 rounded-lg bg-black/20 backdrop-blur-sm border-2 border-red-500/50"
      style={cardStyle}
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Urgent Help Center
        </h2>
        <p className="text-white/80 mb-6">
          This space will display messages from your connected users who want to
          help.
        </p>
        <div className="w-full max-w-md p-4 rounded-lg bg-white/5 border border-white/10 mb-6">
          <p className="text-sm text-white/70">
            When someone responds to your urgent status, their message will
            appear here. Click on their message to open a whiteboard connection.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 w-64 h-32 flex items-center justify-center">
            <p className="text-white/50 text-sm">
              Placeholder for incoming messages
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 w-64 h-32 flex items-center justify-center">
            <p className="text-white/50 text-sm">
              Placeholder for incoming messages
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrgentHelp;
