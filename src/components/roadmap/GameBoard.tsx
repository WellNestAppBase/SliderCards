import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Define the roadmap stages data structure
export interface RoadmapStage {
  stage: number;
  name: string;
  duration: string;
  details: string;
  keyActions: string[];
  color: string;
  position: {
    x: number;
    y: number;
  };
  path?: {
    direction: "right" | "down" | "left" | "up";
    length: number;
  };
  moodColor?: string;
  icon?: string;
}

interface GameBoardProps {
  roadmapStages: RoadmapStage[];
  currentStageIndex: number;
  gamePosition: any; // framer-motion useTransform return type
  calculateGamePiecePosition: (progress: number) => { x: number; y: number };
}

const GameBoard: React.FC<GameBoardProps> = ({
  roadmapStages,
  currentStageIndex,
  gamePosition,
  calculateGamePiecePosition,
}) => {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[800px] bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-800 p-8 overflow-hidden shadow-2xl">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80')] bg-cover opacity-10"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      {/* Themed background elements */}
      <div className="absolute inset-0 z-0">
        {/* Mood colors from B2GTHR */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#4f6a8f] opacity-10 filter blur-xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 rounded-full bg-[#88a2bc] opacity-10 filter blur-xl"></div>
        <div className="absolute bottom-20 left-40 w-36 h-36 rounded-full bg-[#8eb896] opacity-10 filter blur-xl"></div>
        <div className="absolute bottom-40 right-40 w-28 h-28 rounded-full bg-[#fcc580] opacity-10 filter blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-44 h-44 rounded-full bg-[#d9895f] opacity-10 filter blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-20 left-1/2 w-24 h-24 rounded-full bg-[#a24944] opacity-10 filter blur-xl"></div>
      </div>

      {/* Game board path with themed elements */}
      <div className="relative w-full h-full z-10">
        {/* Draw the path connections with improved styling */}
        {roadmapStages.map((stage, index) => {
          if (!stage.path) return null;

          const { direction, length } = stage.path;
          const { x, y } = stage.position;

          let pathStyle = {};
          let pathClasses = "absolute";

          if (direction === "right") {
            pathStyle = { left: x + 60, top: y + 30, width: length, height: 8 };
          } else if (direction === "down") {
            pathStyle = { left: x + 30, top: y + 60, width: 8, height: length };
          } else if (direction === "left") {
            pathStyle = {
              left: x - length + 4,
              top: y + 30,
              width: length,
              height: 8,
            };
          } else if (direction === "up") {
            pathStyle = {
              left: x + 30,
              top: y - length + 4,
              width: 8,
              height: length,
            };
          }

          // Highlight path if it's before or at the current stage
          if (index < currentStageIndex) {
            pathClasses +=
              " bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg";
          } else {
            pathClasses += " bg-gradient-to-r from-gray-700 to-gray-600";
          }

          return (
            <div
              key={`path-${index}`}
              className={pathClasses}
              style={pathStyle}
            >
              {/* Add dots along the path for visual interest */}
              {index < currentStageIndex && (
                <div className="absolute inset-0 flex items-center justify-around">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-200"></div>
                </div>
              )}
            </div>
          );
        })}

        {/* Draw the stage nodes with B2GTHR themed styling */}
        {roadmapStages.map((stage, index) => {
          const { x, y } = stage.position;
          const isActive = index === currentStageIndex;
          const isCompleted = index < currentStageIndex;
          const isPending = index > currentStageIndex;

          // Get mood color based on stage index
          const moodColors = [
            "#4f6a8f", // Deeply Serene
            "#88a2bc", // Calm and Peaceful
            "#8eb896", // Mild/Neutral
            "#fcc580", // Something Feels Off
            "#d9895f", // High Alert
            "#a24944", // Urgent
          ];

          const moodColor =
            stage.moodColor || moodColors[index % moodColors.length];

          return (
            <motion.div
              key={`stage-${index}`}
              className={cn(
                "absolute rounded-xl flex flex-col items-center justify-center w-24 h-24 cursor-pointer",
                isActive ? "ring-4 ring-white shadow-lg shadow-white/20" : "",
                isCompleted
                  ? "bg-gradient-to-br from-pink-500/90 to-purple-600/90"
                  : isActive
                    ? "bg-gradient-to-br from-blue-500/90 to-purple-600/90"
                    : "bg-gray-800/90",
                hoveredStage === index ? "scale-110 z-20" : "z-10",
                "backdrop-blur-sm transition-all duration-300",
              )}
              style={{
                left: x,
                top: y,
                boxShadow:
                  isActive || isCompleted
                    ? `0 0 20px ${isActive ? "rgba(255,255,255,0.3)" : "rgba(236,72,153,0.3)"}`
                    : "none",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: hoveredStage === index ? 1.1 : 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredStage(index)}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <div className="flex items-center justify-center mb-1">
                <span className="text-white font-bold text-2xl">
                  {stage.stage}
                </span>
              </div>
              <div className="text-xs text-center px-1">
                {stage.name.split(" ").map((word, i) => (
                  <span key={i} className="inline-block">
                    {word}{" "}
                  </span>
                ))}
              </div>

              {/* Mood indicator dot */}
              <div
                className={cn(
                  "absolute -top-2 -right-2 w-5 h-5 rounded-full border-2",
                  isCompleted || isActive ? "border-white" : "border-gray-600",
                )}
                style={{ backgroundColor: moodColor }}
              ></div>

              {/* Status indicator */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    isCompleted
                      ? "bg-green-500/20 text-green-300"
                      : isActive
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-gray-700/20 text-gray-400",
                  )}
                >
                  {isCompleted
                    ? "Completed"
                    : isActive
                      ? "Current"
                      : "Upcoming"}
                </span>
              </div>

              {/* Enhanced hover tooltip */}
              {hoveredStage === index && (
                <motion.div
                  className="absolute -top-36 left-1/2 transform -translate-x-1/2 bg-gray-900/95 p-4 rounded-lg border border-gray-700 w-64 z-30 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-bold text-pink-400">
                      {stage.duration}
                    </div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: moodColor }}
                    ></div>
                  </div>
                  <div className="text-sm font-medium mb-2">
                    {stage.details}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">Key Actions:</div>
                  <ul className="text-xs text-gray-300 mt-1 space-y-1">
                    {stage.keyActions.slice(0, 2).map((action, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-1 text-pink-400">•</span> {action}
                      </li>
                    ))}
                  </ul>
                  <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-gray-700"></div>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Enhanced animated game piece */}
        <motion.div
          className="absolute w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg shadow-purple-500/50 z-20 flex items-center justify-center"
          style={{
            left: calculateGamePiecePosition(gamePosition.get()).x - 2,
            top: calculateGamePiecePosition(gamePosition.get()).y - 2,
            transition: "transform 0.1s ease-out",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          {/* B2GTHR logo or icon */}
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold text-xs">
            B2G
          </div>
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-pink-500 animate-ping opacity-30"></div>
        </motion.div>
      </div>

      {/* Enhanced legend with B2GTHR context */}
      <div className="absolute bottom-4 right-4 bg-gray-900/90 p-4 rounded-lg border border-gray-700 backdrop-blur-sm">
        <div className="text-sm font-medium mb-3 text-white">
          B2GTHR Journey
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mr-2"></div>
          <span className="text-xs text-gray-300">Completed Milestones</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 ring-2 ring-white mr-2"></div>
          <span className="text-xs text-gray-300">Current Focus</span>
        </div>
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 rounded-full bg-gray-800 mr-2"></div>
          <span className="text-xs text-gray-300">Future Development</span>
        </div>
        <div className="text-xs text-gray-400 italic">
          Scroll to explore our journey
        </div>
      </div>

      {/* Timeline indicator */}
      <div className="absolute top-4 left-4 bg-gray-900/90 p-3 rounded-lg border border-gray-700 backdrop-blur-sm">
        <div className="text-xs font-medium mb-1 text-gray-400">Timeline</div>
        <div className="text-sm font-bold text-white">
          April 1 - July 1, 2025
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
