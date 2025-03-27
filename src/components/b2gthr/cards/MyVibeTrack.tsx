import React from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";

interface MyVibeTrackProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit?: (context: string) => void;
  cardStyle?: React.CSSProperties;
}

const MyVibeTrack: React.FC<MyVibeTrackProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit = () => {},
  cardStyle = {},
}) => {
  // Sample mood history data
  const moodHistory = [
    { date: "Today", mood: 2, context: "Just a regular day" },
    { date: "Yesterday", mood: 1, context: "Feeling pretty good after yoga" },
    { date: "2 days ago", mood: 3, context: "Work stress is building up" },
    { date: "3 days ago", mood: 0, context: "Had a great day at the beach" },
    { date: "4 days ago", mood: 2, context: "Normal day, nothing special" },
    { date: "5 days ago", mood: 4, context: "Argument with coworker" },
    { date: "6 days ago", mood: 1, context: "Relaxing weekend" },
  ];

  // Weekly summary
  const averageMood = 2; // Mild/Neutral

  return (
    <SlideCard
      title="MyVibeTrack"
      currentMood={currentMood}
      setCurrentMood={setCurrentMood}
      moodOptions={moodOptions}
      onContextSubmit={onContextSubmit}
      cardStyle={cardStyle}
    >
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-3">Weekly Summary</h3>
          <div className="p-4 bg-black/30 backdrop-blur-sm rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-md"
                style={{ backgroundColor: moodOptions[averageMood].color }}
              ></div>
              <div>
                <div className="font-medium">Your average mood</div>
                <div className="text-sm opacity-70">
                  {moodOptions[averageMood].name}
                </div>
              </div>
            </div>
            <p className="text-sm">
              This week you've been mostly{" "}
              {moodOptions[averageMood].name.toLowerCase()}. You had one day
              where you felt {moodOptions[4].name.toLowerCase()} due to work
              stress.
            </p>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Mood Timeline</h3>
            <button className="text-sm text-cyan-400 hover:underline">
              View Full History
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {moodHistory.map((entry, idx) => (
              <div
                key={idx}
                className="p-3 bg-black/30 backdrop-blur-sm rounded-lg"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="w-6 h-6 rounded-md"
                    style={{ backgroundColor: moodOptions[entry.mood].color }}
                  ></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {moodOptions[entry.mood].name}
                      </span>
                      <span className="text-sm opacity-70">{entry.date}</span>
                    </div>
                  </div>
                </div>
                {entry.context && (
                  <p className="text-sm opacity-80 ml-9">"{entry.context}"</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">Mood Insights</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg">
              <h4 className="font-medium text-sm mb-1">Most Common</h4>
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-md"
                  style={{ backgroundColor: moodOptions[2].color }}
                ></div>
                <span>{moodOptions[2].name}</span>
              </div>
            </div>
            <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg">
              <h4 className="font-medium text-sm mb-1">Least Common</h4>
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-md"
                  style={{ backgroundColor: moodOptions[5].color }}
                ></div>
                <span>{moodOptions[5].name}</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm font-medium">
              Export Data
            </button>
            <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-sm font-medium">
              Share Insights
            </button>
          </div>
        </section>
      </div>
    </SlideCard>
  );
};

export default MyVibeTrack;
