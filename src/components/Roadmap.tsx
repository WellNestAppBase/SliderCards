import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import GameBoard from "./roadmap/GameBoard";
import StageDetails from "./roadmap/StageDetails";
import { roadmapStages } from "./roadmap/RoadmapData";

const Roadmap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Fixed progress calculation not based on scroll
  const totalStages = roadmapStages.length;
  const progressPerStage = 100 / totalStages;

  // Use a fixed value instead of scroll-based transform
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [manualProgress, setManualProgress] = useState(0);
  const gamePosition = { get: () => manualProgress };

  // Update progress when stage changes
  useEffect(() => {
    setManualProgress(currentStageIndex);
  }, [currentStageIndex]);

  // Calculate the position for the game piece based on the current progress
  const calculateGamePiecePosition = (progress: number) => {
    const currentIndex = Math.min(
      Math.floor(progress),
      roadmapStages.length - 1,
    );
    const nextIndex = Math.min(currentIndex + 1, roadmapStages.length - 1);
    const fraction = progress - currentIndex;

    // If we're at the last stage, just return its position
    if (currentIndex === roadmapStages.length - 1) {
      return {
        x: roadmapStages[currentIndex].position.x + 20,
        y: roadmapStages[currentIndex].position.y + 20,
      };
    }

    // Get current and next stage positions
    const currentPos = roadmapStages[currentIndex].position;
    const nextPos = roadmapStages[nextIndex].position;

    // If there's no path, just interpolate directly between points
    if (!roadmapStages[currentIndex].path) {
      return {
        x: currentPos.x + 20 + (nextPos.x - currentPos.x) * fraction,
        y: currentPos.y + 20 + (nextPos.y - currentPos.y) * fraction,
      };
    }

    // Handle movement along the path
    const { direction, length } = roadmapStages[currentIndex].path!;

    if (direction === "right") {
      return {
        x: currentPos.x + 20 + length * fraction,
        y: currentPos.y + 20,
      };
    } else if (direction === "down") {
      return {
        x: currentPos.x + 20,
        y: currentPos.y + 20 + length * fraction,
      };
    } else if (direction === "left") {
      return {
        x: currentPos.x + 20 - length * fraction,
        y: currentPos.y + 20,
      };
    } else if (direction === "up") {
      return {
        x: currentPos.x + 20,
        y: currentPos.y + 20 - length * fraction,
      };
    }

    // Fallback
    return {
      x: currentPos.x + 20,
      y: currentPos.y + 20,
    };
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white" ref={containerRef}>
      {/* Enhanced Hero Section with B2GTHR Theme */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Animated background with mood colors */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#121212]">
            {/* Mood color elements */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#4f6a8f] opacity-20 filter blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#88a2bc] opacity-20 filter blur-[100px] animate-pulse"></div>
            <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-[#8eb896] opacity-15 filter blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-[#fcc580] opacity-15 filter blur-[100px] animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-[#d9895f] opacity-15 filter blur-[100px] animate-pulse"></div>
            <div className="absolute top-1/4 right-1/3 w-48 h-48 rounded-full bg-[#a24944] opacity-15 filter blur-[100px] animate-pulse"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-purple-500 mb-2"></div>
              <span className="text-pink-500 font-semibold tracking-wider">
                DEVELOPMENT JOURNEY
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              <span className="text-white">ROADMAP TO </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                B2GTHR
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-6 max-w-3xl text-gray-300">
              Our journey from concept to launch, starting April 1, 2025
            </p>
            <p className="text-md mb-10 max-w-2xl text-gray-400">
              Follow our development path as we build a platform to help people
              stay connected through emotional awareness
            </p>

            {/* Mood scale preview */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {[
                "#4f6a8f",
                "#88a2bc",
                "#8eb896",
                "#fcc580",
                "#d9895f",
                "#a24944",
              ].map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-125"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/funding-schedule">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-500 text-purple-400 hover:bg-purple-950/30 font-bold px-8 py-6 text-lg rounded-md"
                >
                  FUNDING SCHEDULE
                </Button>
              </Link>
              <Link to="/investment">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-500 text-blue-400 hover:bg-blue-950/30 font-bold px-8 py-6 text-lg rounded-md"
                >
                  INVESTMENT OPPORTUNITIES
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Progress Section with B2GTHR Theme */}
      <section className="py-16 bg-gradient-to-r from-[#4f6a8f]/20 via-[#88a2bc]/20 to-[#a24944]/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-4">B2GTHR Launch Progress</h2>
            <p className="text-gray-400 max-w-2xl text-center mb-8">
              Track our journey from concept to connecting people through
              emotional awareness
            </p>

            <div className="w-full max-w-3xl mb-6 relative">
              {/* Mood color indicators along the progress bar */}
              <div className="absolute top-0 left-0 w-full h-full flex">
                {roadmapStages.map((stage, index) => (
                  <div
                    key={index}
                    className="h-full flex-1 opacity-30"
                    style={{
                      backgroundColor: stage.moodColor,
                      clipPath:
                        index === 0
                          ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                          : index === roadmapStages.length - 1
                            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                            : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                    }}
                  />
                ))}
              </div>

              <Progress
                value={progressPerStage * (currentStageIndex + 1)}
                className="h-6 bg-gray-800/50 backdrop-blur-sm"
              />

              {/* Stage markers */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center">
                {roadmapStages.map((stage, index) => {
                  const position = (index / (roadmapStages.length - 1)) * 100;
                  const isCompleted = index <= currentStageIndex;
                  return (
                    <div
                      key={index}
                      className={cn(
                        "absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2",
                        isCompleted
                          ? "bg-white border-white"
                          : "bg-gray-800 border-gray-600",
                      )}
                      style={{ left: `${position}%` }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden group-hover:block w-24 text-center">
                        <span className="text-xs">{stage.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between w-full max-w-3xl">
              <div className="text-center">
                <span className="text-gray-400 block">Start</span>
                <span className="text-white font-medium">April 1, 2025</span>
              </div>

              <div className="text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                <span className="block font-bold text-lg">
                  Stage {currentStageIndex + 1}:{" "}
                  {roadmapStages[currentStageIndex].name}
                </span>
                <span className="text-sm text-gray-300">
                  {roadmapStages[currentStageIndex].duration}
                </span>
              </div>

              <div className="text-center">
                <span className="text-gray-400 block">Launch</span>
                <span className="text-white font-medium">July 1, 2025+</span>
              </div>
            </div>

            {/* Mood legend */}
            <div className="mt-10 bg-gray-900/30 p-4 rounded-lg border border-gray-800">
              <div className="text-sm font-medium mb-3">B2GTHR Mood Scale</div>
              <div className="flex flex-wrap gap-3 justify-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#4f6a8f] mr-2"></div>
                  <span className="text-xs text-gray-300">Deeply Serene</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#88a2bc] mr-2"></div>
                  <span className="text-xs text-gray-300">Calm</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#8eb896] mr-2"></div>
                  <span className="text-xs text-gray-300">Neutral</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#fcc580] mr-2"></div>
                  <span className="text-xs text-gray-300">Something Off</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#d9895f] mr-2"></div>
                  <span className="text-xs text-gray-300">High Alert</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#a24944] mr-2"></div>
                  <span className="text-xs text-gray-300">Urgent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Board Section - Themed as a B2GTHR Journey */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#080818] min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-12">
            {/* Game Board */}
            <div className="w-full">
              <GameBoard
                roadmapStages={roadmapStages}
                currentStageIndex={currentStageIndex}
                gamePosition={gamePosition}
                calculateGamePiecePosition={calculateGamePiecePosition}
              />
            </div>

            {/* Stage Details Carousel */}
            <div className="w-full mt-8">
              <h2 className="text-3xl font-bold mb-6 text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                  Journey Details
                </span>
              </h2>
              <StageDetails
                roadmapStages={roadmapStages}
                currentStageIndex={currentStageIndex}
                gamePosition={gamePosition}
                onStageChange={(index) => setCurrentStageIndex(index)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Roadmap;
