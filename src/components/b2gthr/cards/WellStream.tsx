import React, { useEffect, useState } from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";
import {
  useRealtimeMoodUpdates,
  Connection,
} from "../../../hooks/useRealtimeMoodUpdates";
import { useAuth } from "../../../contexts/AuthContext";
import { updateUserMood } from "../../../services/profileService";
import { fetchSharedBoard } from "../../../services/sharedBoardService";

interface WellStreamProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit: (context: string) => void;
  cardStyle: React.CSSProperties;
}

const WellStream: React.FC<WellStreamProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit,
  cardStyle,
}) => {
  const { user } = useAuth();
  const [selectedConnectionId, setSelectedConnectionId] = useState<
    number | null
  >(null);

  // Initial mock data for connections
  const initialConnections = [
    {
      id: 1,
      name: "Emma Rodriguez",
      mood: 5, // Urgent
      lastUpdated: "5 min ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      context: "Feeling overwhelmed with work deadlines",
    },
    {
      id: 2,
      name: "Michael Chen",
      mood: 2, // Mild/Neutral
      lastUpdated: "20 min ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      context: "",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      mood: 1, // Calm and Peaceful
      lastUpdated: "1 hour ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      context: "Just finished meditation",
    },
    {
      id: 4,
      name: "David Kim",
      mood: 4, // High Alert
      lastUpdated: "30 min ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      context: "Nervous about presentation tomorrow",
    },
    {
      id: 5,
      name: "Alex Morgan",
      mood: 0, // Deeply Serene
      lastUpdated: "2 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      context: "Enjoying a peaceful weekend",
    },
    {
      id: 6,
      name: "Jamie Lee",
      mood: 3, // Something Feels Off
      lastUpdated: "45 min ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jamie",
      context: "Not sure why, but feeling a bit off today",
    },
    {
      id: 7,
      name: "Taylor Swift",
      mood: 1, // Calm and Peaceful
      lastUpdated: "3 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=taylor",
      context: "Writing new songs, feeling inspired",
    },
  ];

  // Use the custom hook for real-time mood updates
  const { connections, loading } = useRealtimeMoodUpdates(initialConnections);

  // Log when real-time updates are received
  useEffect(() => {
    console.log("WellStream received updated connections:", connections);
  }, [connections]);

  // Update user's mood in the database when it changes
  useEffect(() => {
    if (user) {
      updateUserMood(user.id, currentMood);
    }
  }, [currentMood, user]);

  // Handle viewing a shared board
  const handleViewSharedBoard = (connection: Connection) => {
    if (connection.sharedBoardId) {
      setSelectedConnectionId(connection.id);

      // In a real implementation, you would navigate to the SharedBoard component
      // and pass the connection ID as a parameter
      console.log(
        `Viewing shared board with ${connection.name}, ID: ${connection.sharedBoardId}`,
      );

      // This would typically be handled by a router or state management system
      // For now, we'll just log it
    }
  };

  // Sort connections to prioritize urgent moods
  const sortedConnections = [...connections].sort((a, b) => {
    // Prioritize urgent moods (5) at the top
    if (a.mood === 5 && b.mood !== 5) return -1;
    if (a.mood !== 5 && b.mood === 5) return 1;
    // Then high alert (4)
    if (a.mood === 4 && b.mood !== 4 && b.mood !== 5) return -1;
    if (a.mood !== 4 && a.mood !== 5 && b.mood === 4) return 1;
    // Otherwise sort by most recently updated
    return 0;
  });

  return (
    <SlideCard
      title="WellStream"
      currentMood={currentMood}
      setCurrentMood={setCurrentMood}
      moodOptions={moodOptions}
      onContextSubmit={(context) => {
        onContextSubmit(context);
        // Update the mood context in the database if user is logged in
        if (user) {
          updateUserMood(user.id, currentMood, context);
        }
      }}
      cardStyle={cardStyle}
    >
      <div className="space-y-4">
        <p className="text-center opacity-80 mb-4">
          See how your connections are doing and reach out if needed.
        </p>

        {/* Connection cards */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {sortedConnections.map((connection) => (
            <div
              key={connection.id}
              className={`p-4 rounded-lg ${connection.mood === 5 ? "bg-red-900/30 border border-red-500/50" : "bg-black/20 border border-white/10"}`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30">
                    <img
                      src={connection.avatar}
                      alt={connection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-black"
                    style={{
                      backgroundColor: moodOptions[connection.mood].color,
                    }}
                  ></div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {connection.name}
                      {connection.mood === 5 && (
                        <span className="ml-2 text-red-400 animate-pulse">
                          ⚠️
                        </span>
                      )}
                    </h3>
                    <span className="text-sm opacity-70">
                      {connection.lastUpdated}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${connection.mood === 5 ? "bg-red-500/30 text-red-200" : "bg-black/30"}`}
                    >
                      {moodOptions[connection.mood].name}
                    </span>
                  </div>
                  {connection.context && (
                    <p className="mt-2 text-sm opacity-80">
                      "{connection.context}"
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => console.log(`Message ${connection.name}`)}
                  className="px-3 py-1.5 rounded-md bg-black/30 hover:bg-black/50 text-sm"
                >
                  Message
                </button>
                <button
                  onClick={() => console.log(`Call ${connection.name}`)}
                  className="px-3 py-1.5 rounded-md bg-black/30 hover:bg-black/50 text-sm"
                >
                  Call
                </button>
                {connection.sharedBoardId ? (
                  <button
                    onClick={() => handleViewSharedBoard(connection)}
                    className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Shared Board
                  </button>
                ) : null}
                {connection.mood >= 4 && (
                  <button
                    onClick={() =>
                      console.log(`Check in with ${connection.name}`)
                    }
                    className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm"
                  >
                    Check In
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideCard>
  );
};

export default WellStream;
