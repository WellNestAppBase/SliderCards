import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateUserMood } from "../../services/profileService";

export interface MoodOption {
  name: string;
  color: string;
  textClass: string;
  description: string;
}

interface MoodSelectorProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  showContextPrompt?: boolean;
  onContextSubmit?: (context: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  showContextPrompt = false,
  onContextSubmit = () => {},
}) => {
  const { user } = useAuth();
  const [showContext, setShowContext] = React.useState(false);
  const [context, setContext] = React.useState("");

  // Update mood in database when it changes (without context)
  useEffect(() => {
    if (user && !showContext) {
      // Only update if we're not waiting for context input
      updateUserMood(user.id, currentMood);
    }
  }, [currentMood, user, showContext]);

  const handleMoodSelect = (index: number) => {
    setCurrentMood(index);
    if (showContextPrompt) {
      setShowContext(true);
    } else if (user) {
      // If we're not showing context prompt, update immediately
      updateUserMood(user.id, index);
    }
  };

  const handleContextSubmit = () => {
    onContextSubmit(context);
    setShowContext(false);
    setContext("");
    console.log(`Mood selected: ${currentMood}, Context: ${context}`);

    // Update mood with context in database
    if (user) {
      updateUserMood(user.id, currentMood, context);
    }
  };

  return (
    <div className="w-full rounded-b-lg overflow-hidden">
      {showContext && (
        <div className="mb-4 p-3.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-inner">
          <p className="text-sm mb-2">
            How are you feeling? (Optional context)
          </p>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full p-2.5 bg-gray-800/80 border border-gray-600 rounded-md text-sm mb-2 focus:ring-1 focus:ring-white/30 focus:outline-none shadow-inner"
            placeholder={`Why are you feeling ${moodOptions[currentMood]?.name?.toLowerCase() || "this way"}?`}
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowContext(false)}
              className="px-3.5 py-1.5 text-xs rounded-md bg-gray-700 hover:bg-gray-600 transition-colors shadow-sm"
            >
              Skip
            </button>
            <button
              onClick={handleContextSubmit}
              className="px-3.5 py-1.5 text-xs rounded-md bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col w-full border-t border-white/10 pt-1.5 mt-1">
        <div className="relative flex w-full h-16 mt-1.5 rounded-b-lg overflow-hidden shadow-md">
          {" "}
          {/* Increased height to accommodate text */}
          {moodOptions.map((mood, idx) => {
            const isSelected = currentMood === idx;
            return (
              <button
                key={idx}
                onClick={() => handleMoodSelect(idx)}
                className={`relative group flex-1 transition-all duration-300`}
                style={{
                  zIndex: isSelected ? 10 : 5 - Math.abs(idx - currentMood),
                }}
                aria-label={`Switch to ${mood.name} mood`}
                title={mood?.name || "Mood option"}
              >
                <div
                  className={`absolute top-0 w-full transition-all duration-300 flex items-center justify-center ${isSelected ? "h-16 rounded-b-lg shadow-inner" : "h-12 rounded-b-md"}`}
                  style={{
                    backgroundColor: mood?.color || "#888888",
                    opacity: isSelected ? 1 : 0.7,
                    transform: isSelected
                      ? "translateY(0)"
                      : `translateY(-${Math.abs(idx - currentMood) * 2}px)`,
                    left: 0,
                    right: 0,
                  }}
                >
                  <span
                    className={`text-xs font-semibold ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-70"} transition-opacity duration-200 ${mood?.textClass || ""} text-center px-1.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-full`}
                    style={{
                      textShadow: "0px 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    {mood?.name || ""}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoodSelector;
