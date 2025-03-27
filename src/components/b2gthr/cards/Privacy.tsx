import React, { useState } from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";

interface PrivacyProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit: (context: string) => void;
  cardStyle: React.CSSProperties;
}

const Privacy: React.FC<PrivacyProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit,
  cardStyle,
}) => {
  const [activeTab, setActiveTab] = useState("visibility"); // visibility, data, terms

  // Mock data for connections to manage visibility
  const connections = [
    {
      id: 1,
      name: "Emma Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      canSeeAllMoods: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      canSeeAllMoods: false,
    },
    {
      id: 3,
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      canSeeAllMoods: true,
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      canSeeAllMoods: false,
    },
  ];

  return (
    <SlideCard
      title="Privacy"
      currentMood={currentMood}
      setCurrentMood={setCurrentMood}
      moodOptions={moodOptions}
      onContextSubmit={onContextSubmit}
      cardStyle={cardStyle}
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-white/20">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "visibility" ? "border-b-2 border-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("visibility")}
          >
            Mood Visibility
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "data" ? "border-b-2 border-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("data")}
          >
            Data Settings
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "terms" ? "border-b-2 border-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("terms")}
          >
            Terms & Policies
          </button>
        </div>

        {/* Tab content */}
        <div className="max-h-[350px] overflow-y-auto pr-2">
          {activeTab === "visibility" && (
            <div className="space-y-4">
              <p className="opacity-80">
                Control who can see your mood and when. You can hide specific
                moods from certain connections.
              </p>

              <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                <h4 className="font-medium mb-3">Global Mood Visibility</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="visibility"
                        className="accent-cyan-500"
                        defaultChecked
                      />
                      <span>All connections can see my mood</span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="visibility"
                        className="accent-cyan-500"
                      />
                      <span>Only selected connections can see my mood</span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="visibility"
                        className="accent-cyan-500"
                      />
                      <span>No one can see my mood</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                <h4 className="font-medium mb-3">Hide Specific Moods</h4>
                <div className="space-y-3">
                  {moodOptions.map((mood, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: mood.color }}
                        ></div>
                        <span>{mood.name}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked={idx !== 5} // Hide "Urgent" by default
                        />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                        <span className="ml-2 text-sm font-medium">
                          {idx !== 5 ? "Visible" : "Hidden"}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                <h4 className="font-medium mb-3">Per-Connection Settings</h4>
                <div className="space-y-3">
                  {connections.map((connection) => (
                    <div
                      key={connection.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30">
                          <img
                            src={connection.avatar}
                            alt={connection.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span>{connection.name}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked={connection.canSeeAllMoods}
                        />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                        <span className="ml-2 text-sm font-medium">
                          {connection.canSeeAllMoods ? "All moods" : "Limited"}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-4">
              <p className="opacity-80">
                Manage how your data is stored, shared, and used within the app.
              </p>

              <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                <h4 className="font-medium mb-3">Data Collection</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mood History</p>
                      <p className="text-sm opacity-70">
                        Store your mood history for personal tracking
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Usage Analytics</p>
                      <p className="text-sm opacity-70">
                        Help us improve by sharing anonymous usage data
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Location Data</p>
                      <p className="text-sm opacity-70">
                        Allow location-based features
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                <h4 className="font-medium mb-3">Data Management</h4>
                <div className="space-y-3">
                  <button className="w-full py-2 rounded-md bg-black/30 hover:bg-black/50 text-sm text-left px-3">
                    Export My Data
                  </button>
                  <button className="w-full py-2 rounded-md bg-black/30 hover:bg-black/50 text-sm text-left px-3">
                    Delete Mood History
                  </button>
                  <button className="w-full py-2 rounded-md bg-red-900/30 hover:bg-red-900/50 text-sm text-left px-3">
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-4">
              <p className="opacity-80">
                Review our terms of service, privacy policy, and other legal
                documents.
              </p>

              <div className="space-y-3">
                <a
                  href="#"
                  className="block p-4 rounded-lg bg-black/20 border border-white/10 hover:bg-black/30"
                >
                  <h4 className="font-medium">Terms of Service</h4>
                  <p className="text-sm opacity-70 mt-1">
                    Last updated: June 1, 2023
                  </p>
                </a>
                <a
                  href="#"
                  className="block p-4 rounded-lg bg-black/20 border border-white/10 hover:bg-black/30"
                >
                  <h4 className="font-medium">Privacy Policy</h4>
                  <p className="text-sm opacity-70 mt-1">
                    Last updated: June 1, 2023
                  </p>
                </a>
                <a
                  href="#"
                  className="block p-4 rounded-lg bg-black/20 border border-white/10 hover:bg-black/30"
                >
                  <h4 className="font-medium">Data Processing Agreement</h4>
                  <p className="text-sm opacity-70 mt-1">
                    Last updated: June 1, 2023
                  </p>
                </a>
                <a
                  href="#"
                  className="block p-4 rounded-lg bg-black/20 border border-white/10 hover:bg-black/30"
                >
                  <h4 className="font-medium">Cookie Policy</h4>
                  <p className="text-sm opacity-70 mt-1">
                    Last updated: June 1, 2023
                  </p>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </SlideCard>
  );
};

export default Privacy;
