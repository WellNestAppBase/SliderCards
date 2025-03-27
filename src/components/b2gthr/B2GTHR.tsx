import React, { useState, useEffect } from "react";
import Loading from "../ui/loading";
import Dashboard from "./cards/Dashboard";
import WellStream from "./cards/WellStream";
import ManageConnections from "./cards/ManageConnections";
import SharedBoard from "./cards/SharedBoard";
import Privacy from "./cards/Privacy";
import ManageProfile from "./cards/ManageProfile";
import MyVibeTrack from "./cards/MyVibeTrack";
import ManageSettings from "./cards/ManageSettings";
import Help from "./cards/Help";
import { MoodOption } from "./MoodSelector";
import SlideCarousel from "./SlideCarousel";
import CardContent from "./CardContent";
import MoodSelector from "./MoodSelector";

const B2GTHR: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Page titles for navigation
  const pageTitles = [
    "Privacy",
    "SharedBoard",
    "Manage Connections",
    "WellStream",
    "Dashboard", // Center card (index 4)
    "Manage Profile",
    "MyVibeTrack",
    "Manage Settings",
    "Help",
  ];

  // Mood options with emotional context
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

  // Current mood state
  const [currentMood, setCurrentMood] = useState(2); // Default to Mild/Neutral
  const [moodContext, setMoodContext] = useState("");

  // Handle mood change with transition
  const handleMoodChange = (index: number) => {
    setCurrentMood(index);
    // Apply transition class to body for global effect
    document.body.classList.add("mood-transition");
    setTimeout(() => {
      document.body.classList.remove("mood-transition");
    }, 700);
  };

  // Initialize component and set loading state to false after a short delay
  useEffect(() => {
    // Set loading to false after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Handle mood context submission
  const handleContextSubmit = (context: string) => {
    setMoodContext(context);
    console.log(`Mood: ${moodOptions[currentMood].name}, Context: ${context}`);
    // Here you would typically save this to a database

    // Apply a smooth transition to the background color
    document.documentElement.style.setProperty("--transition-speed", "0.7s");
  };

  // If still loading, show a loading indicator
  if (isLoading) {
    return <Loading fullScreen color="cyan" size="md" text="Loading..." />;
  }

  // Create an array of card components to pass to the carousel
  const cardComponents = [
    // Privacy (-4)
    <CardContent key="privacy" title="Privacy">
      <Privacy
        currentMood={currentMood}
        setCurrentMood={handleMoodChange}
        moodOptions={moodOptions}
        onContextSubmit={handleContextSubmit}
        cardStyle={{}}
      />
    </CardContent>,

    // SharedBoard (-3)
    <CardContent key="sharedboard" title="SharedBoard">
      <SharedBoard
        currentMood={currentMood}
        setCurrentMood={handleMoodChange}
        moodOptions={moodOptions}
        onContextSubmit={handleContextSubmit}
        cardStyle={{}}
      />
    </CardContent>,

    // Manage Connections (-2)
    <CardContent key="connections" title="Manage Connections">
      <ManageConnections
        currentMood={currentMood}
        setCurrentMood={handleMoodChange}
        moodOptions={moodOptions}
        onContextSubmit={handleContextSubmit}
        cardStyle={{}}
      />
    </CardContent>,

    // WellStream (-1)
    <CardContent key="wellstream" title="WellStream">
      <WellStream
        currentMood={currentMood}
        setCurrentMood={handleMoodChange}
        moodOptions={moodOptions}
        onContextSubmit={handleContextSubmit}
        cardStyle={{}}
      />
    </CardContent>,

    // Dashboard (0)
    <CardContent key="dashboard" title="Dashboard">
      <Dashboard
        currentMood={currentMood}
        setCurrentMood={handleMoodChange}
        moodOptions={moodOptions}
        onContextSubmit={handleContextSubmit}
        cardStyle={{}}
      />
    </CardContent>,

    // Manage Profile (+1)
    <CardContent key="profile" title="Manage Profile">
      <ManageProfile
        currentMood={currentMood}
        setCurrentMood={handleMoodChange}
        moodOptions={moodOptions}
        onContextSubmit={handleContextSubmit}
        cardStyle={{}}
      />
    </CardContent>,

    // MyVibeTrack (+2)
    <CardContent key="vibetrack" title="MyVibeTrack">
      <MyVibeTrack
        currentMood={currentMood}
        setCurrentMood={handleMoodChange}
        moodOptions={moodOptions}
        onContextSubmit={handleContextSubmit}
        cardStyle={{}}
      />
    </CardContent>,

    // Manage Settings (+3)
    <CardContent key="settings" title="Manage Settings">
      <ManageSettings
        currentMood={currentMood}
        setCurrentMood={handleMoodChange}
        moodOptions={moodOptions}
        onContextSubmit={handleContextSubmit}
        cardStyle={{}}
      />
    </CardContent>,

    // Help (+4)
    <CardContent key="help" title="Help">
      <Help
        currentMood={currentMood}
        setCurrentMood={handleMoodChange}
        moodOptions={moodOptions}
        onContextSubmit={handleContextSubmit}
        cardStyle={{}}
      />
    </CardContent>,
  ];

  return (
    <div
      className={`relative h-screen w-screen ${moodOptions[currentMood].textClass} overflow-hidden transition-all duration-700`}
      style={{ backgroundColor: moodOptions[currentMood].color }}
    >
      {/* Global glow effect */}
      <div
        className="absolute inset-0 blur-[118px] max-w-3xl h-[600px] mx-auto transition-all duration-1000"
        style={{
          background: `linear-gradient(106.89deg, ${moodOptions[currentMood].color}40 15.73%, ${moodOptions[(currentMood + 2) % 6].color}40 56.49%, ${moodOptions[(currentMood + 4) % 6].color}40 115.91%)`,
          zIndex: 0,
        }}
      ></div>

      {/* Main carousel for sliding pages */}
      <SlideCarousel
        initialIndex={4} // Start at Dashboard (index 4)
        pageTitles={pageTitles}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      >
        {cardComponents}
      </SlideCarousel>

      {/* Custom CSS for hiding scrollbar and adding transitions */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
        
        .mood-transition {
          transition: background-color 0.7s ease-in-out;
        }
        
        :root {
          --transition-speed: 0.7s;
        }
      `}</style>
    </div>
  );
};

export default B2GTHR;
