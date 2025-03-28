import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoodOption } from "../MoodSelector";
import { useAuth } from "@/contexts/AuthContext";

const Landing: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to the B2GTHR app
  useEffect(() => {
    if (user && !loading) {
      navigate("/b2gthr");
    }
  }, [user, loading, navigate]);

  // Mood options from B2GTHR component
  const moodOptions: MoodOption[] = [
    {
      name: "Deeply Serene",
      color: "#4f6a8f",
      textClass: "text-white",
      description:
        "A deep, grounding denim blue signifying utmost serenity and inner peace.",
    },
    {
      name: "Calm and Peaceful",
      color: "#88a2bc",
      textClass: "text-gray-900",
      description:
        "A soft, light slate blue embodying quiet relief and relaxation.",
    },
    {
      name: "Mild/Neutral",
      color: "#8eb896",
      textClass: "text-gray-900",
      description: "A muted sage green representing a steady, neutral state.",
    },
    {
      name: "Something Feels Off",
      color: "#fcc580",
      textClass: "text-gray-900",
      description:
        "A gentle, pale peach indicating mild unease or subtle discomfort.",
    },
    {
      name: "High Alert",
      color: "#d9895f",
      textClass: "text-white",
      description:
        "A warm, muted terracotta radiating strong concern and unease.",
    },
    {
      name: "Urgent",
      color: "#a24944",
      textClass: "text-white",
      description:
        "A rich, earthy red signaling a critical state needing immediate attention.",
    },
  ];

  // Default to Mild/Neutral mood for landing page
  const currentMood = 2;

  if (loading) {
    return (
      <div
        className={`min-h-screen w-full ${moodOptions[currentMood].textClass} overflow-hidden transition-colors duration-500 flex items-center justify-center`}
        style={{ backgroundColor: moodOptions[currentMood].color }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white/80 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full ${moodOptions[currentMood].textClass} overflow-hidden transition-colors duration-500 flex flex-col`}
      style={{ backgroundColor: moodOptions[currentMood].color }}
    >
      {/* Global glow effect */}
      <div
        className="absolute inset-0 blur-[118px] max-w-3xl h-[600px] mx-auto"
        style={{
          background: `linear-gradient(106.89deg, ${moodOptions[currentMood].color}40 15.73%, ${moodOptions[(currentMood + 2) % 6].color}40 56.49%, ${moodOptions[(currentMood + 4) % 6].color}40 115.91%)`,
          zIndex: 0,
        }}
      ></div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <div className="text-2xl font-bold">B2GTHR</div>
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="hover:bg-white/10">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-grow flex flex-col md:flex-row items-center justify-center px-6 py-12">
        <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Stay connected with your inner circle
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-lg">
            B2GTHR helps you maintain meaningful connections with loved ones
            through a simple mood-sharing interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/signup">
              <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-lg py-6 px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                className="border-white/30 text-lg py-6 px-8"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-80 h-[500px] bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 shadow-xl">
            <div className="absolute top-0 left-0 right-0 p-4 border-b border-white/10">
              <h3 className="text-xl font-semibold">Dashboard</h3>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-sm font-medium opacity-80">Mood</span>
                <div className="flex gap-2 justify-center w-full">
                  {moodOptions.map((mood, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded-md transition-all duration-300 ${idx === currentMood ? "ring-2 ring-white ring-offset-2 ring-offset-black/50 scale-110" : "opacity-70"}`}
                      style={{ backgroundColor: mood.color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute top-16 bottom-16 left-0 right-0 p-4 overflow-auto">
              <div className="space-y-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-600"></div>
                    <div>
                      <div className="font-medium">Sarah</div>
                      <div className="text-sm opacity-70">
                        Calm and Peaceful
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600"></div>
                    <div>
                      <div className="font-medium">Michael</div>
                      <div className="text-sm opacity-70">Deeply Serene</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-600"></div>
                    <div>
                      <div className="font-medium">Jessica</div>
                      <div className="text-sm opacity-70">
                        Something Feels Off
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center opacity-80 text-sm">
        <p>© {new Date().getFullYear()} B2GTHR. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
