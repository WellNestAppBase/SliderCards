import React, { useState, useEffect } from "react";
import SlideCard from "../SlideCard";
import { MoodOption } from "../MoodSelector";
import { MessageCircle, Phone, AlertTriangle } from "lucide-react";

interface DashboardProps {
  currentMood: number;
  setCurrentMood: (index: number) => void;
  moodOptions: MoodOption[];
  onContextSubmit: (context: string) => void;
  cardStyle: React.CSSProperties;
}

interface Connection {
  id: number;
  name: string;
  mood: number;
  lastUpdated: string;
  avatar: string;
  context: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  currentMood,
  setCurrentMood,
  moodOptions,
  onContextSubmit,
  cardStyle,
}) => {
  const [userName, setUserName] = useState("Samuel");
  const [userAvatar, setUserAvatar] = useState(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=samuel",
  );
  const [connections, setConnections] = useState<Connection[]>([
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
  ]);

  // Check if any connections have urgent mood
  const hasUrgentConnections = connections.some((conn) => conn.mood === 5);

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

  // Calculate average mood for the whirlpool visualization
  const averageMood =
    connections.length > 0
      ? connections.reduce((sum, conn) => sum + conn.mood, 0) /
        connections.length
      : 2; // Default to neutral if no connections

  // Helper function to get time of day for greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  };

  // Handle contact actions
  const handleContact = (connectionId: number, type: "message" | "call") => {
    console.log(`${type} connection ${connectionId}`);
    // In a real app, this would open a messaging interface or initiate a call
  };

  return (
    <SlideCard
      title="Dashboard"
      currentMood={currentMood}
      setCurrentMood={setCurrentMood}
      moodOptions={moodOptions}
      onContextSubmit={onContextSubmit}
      cardStyle={cardStyle}
    >
      <div className="space-y-6 animate-fadeIn">
        {/* Greeting */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 transition-all duration-300">
            Good {getTimeOfDay()}, {userName}
          </h1>
          <p className="text-lg opacity-80 transition-opacity duration-300">
            How are you feeling today?
          </p>
        </div>

        {/* User's profile summary */}
        <div className="flex items-center justify-center gap-4 mb-6 transition-all duration-300">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg transition-transform hover:scale-105">
            <img
              src={userAvatar}
              alt="Your profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{userName}</h2>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full transition-colors duration-500"
                style={{ backgroundColor: moodOptions[currentMood].color }}
              ></div>
              <span className="text-sm transition-colors duration-300">
                {moodOptions[currentMood].name}
              </span>
            </div>
          </div>
        </div>

        {/* WellStream widget */}
        <div
          className={`rounded-xl p-4 transition-all duration-500 ${hasUrgentConnections ? "bg-red-900/20 border border-red-800/30" : "bg-black/10 border border-white/10"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">WellStream</h3>
          </div>

          {/* Enhanced Whirlpool visualization */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg shadow-black/30">
              {/* Outer ripple effect */}
              <div
                className="absolute -inset-2 animate-pulse-slow opacity-50 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${moodOptions[Math.floor(averageMood)].color}80, transparent 70%)`,
                  animationDuration: `${10 - averageMood}s`,
                }}
              ></div>

              {/* Main whirlpool */}
              <div
                className="absolute inset-0 animate-spin-slow rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, ${moodOptions[Math.floor(averageMood)].color}, ${moodOptions[Math.ceil(averageMood) % 6].color})`,
                  animationDuration: `${8 - averageMood}s`, // Faster spin for more urgent moods
                  boxShadow: `inset 0 0 20px 5px rgba(0,0,0,0.3)`,
                }}
              ></div>

              {/* Inner whirlpool */}
              <div
                className="absolute inset-4 animate-spin-reverse rounded-full"
                style={{
                  background: `conic-gradient(from 180deg, ${moodOptions[Math.ceil(averageMood) % 6].color}, ${moodOptions[Math.floor(averageMood)].color})`,
                  animationDuration: `${10 - averageMood}s`,
                  boxShadow: `inset 0 0 15px 3px rgba(0,0,0,0.4)`,
                }}
              ></div>

              {/* Center calm area */}
              <div className="absolute inset-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {moodOptions[Math.round(averageMood)].name}
                </span>
              </div>

              {/* Water-like reflections */}
              <div className="absolute top-1/4 left-1/4 w-1/5 h-1/5 bg-white/20 rounded-full blur-sm animate-float"></div>
              <div className="absolute bottom-1/3 right-1/3 w-1/6 h-1/6 bg-white/10 rounded-full blur-sm animate-float-slow"></div>
            </div>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {sortedConnections.map((connection) => (
              <div
                key={connection.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${connection.mood === 5 ? "bg-red-900/30 border border-red-800/30 animate-pulse-subtle" : "bg-black/20 border border-white/10 hover:bg-black/30"}`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/30 transition-transform hover:scale-105">
                    <img
                      src={connection.avatar}
                      alt={connection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-black transition-colors duration-500"
                    style={{
                      backgroundColor: moodOptions[connection.mood].color,
                    }}
                  ></div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center">
                      {connection.name}
                      {connection.mood === 5 && (
                        <span className="ml-2 text-red-400 animate-pulse">
                          <AlertTriangle className="h-4 w-4" />
                        </span>
                      )}
                    </h4>
                    <span className="text-xs opacity-70">
                      {connection.lastUpdated}
                    </span>
                  </div>
                  <p className="text-sm opacity-80">
                    {connection.mood === 5 ? (
                      <span className="text-red-300 font-medium">
                        {moodOptions[connection.mood].name}
                      </span>
                    ) : (
                      moodOptions[connection.mood].name
                    )}
                    {connection.context && (
                      <span className="ml-1">: "{connection.context}"</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleContact(connection.id, "message")}
                    className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors duration-200"
                    title="Message"
                    aria-label={`Message ${connection.name}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleContact(connection.id, "call")}
                    className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors duration-200"
                    title="Call"
                    aria-label={`Call ${connection.name}`}
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-subtle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-5px) translateX(3px);
            opacity: 0.4;
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.1;
          }
          50% {
            transform: translateY(3px) translateX(-4px);
            opacity: 0.3;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.3;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s infinite ease-in-out;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 10s linear infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }

        .scrollbar-thumb-white\/20::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </SlideCard>
  );
};

export default Dashboard;
