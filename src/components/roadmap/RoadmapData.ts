import { RoadmapStage } from "./GameBoard";

// Define the roadmap stages
export const roadmapStages: RoadmapStage[] = [
  {
    stage: 1,
    name: "CREATE and DESIGN",
    duration: "4 weeks (April 1 - April 28, 2025)",
    details:
      "Refine existing prototype, streamline pages, set up database, design UI",
    keyActions: [
      "Use React for front-end",
      "Node.js/Express for backend",
      "Supabase for database",
      "Finalize UI/UX design",
    ],
    color: "from-blue-500 to-cyan-400",
    position: { x: 50, y: 50 },
    path: { direction: "right", length: 200 },
    moodColor: "#4f6a8f", // Deeply Serene
    icon: "✏️",
  },
  {
    stage: 2,
    name: "FUNDING",
    duration: "1 week (April 28 - May 4, 2025)",
    details:
      "Intensive funding activities: sponsor outreach, grant applications, crowdfunding setup",
    keyActions: [
      "Email sponsors",
      "Submit grants",
      "Launch GoFundMe",
      "Contact local media",
    ],
    color: "from-green-500 to-emerald-400",
    position: { x: 300, y: 50 },
    path: { direction: "down", length: 150 },
    moodColor: "#88a2bc", // Calm and Peaceful
    icon: "💰",
  },
  {
    stage: 3,
    name: "FINE TUNING",
    duration: "2 weeks (May 5 - May 19, 2025)",
    details:
      "Fix bugs, ensure site works, clean documents, get cohesive design",
    keyActions: [
      "Streamline to 3-4 pages",
      "Update design",
      "Continue funding efforts",
      "Prepare for testing",
    ],
    color: "from-purple-500 to-indigo-400",
    position: { x: 300, y: 250 },
    path: { direction: "left", length: 200 },
    moodColor: "#8eb896", // Mild/Neutral
    icon: "🔧",
  },
  {
    stage: 4,
    name: "CHARLIE TESTING",
    duration: "2 weeks (May 19 - June 2, 2025)",
    details:
      "Small group testing with friends, update changes, continue testing",
    keyActions: [
      "Invite 100-200 users for soft testing",
      "Gather feedback",
      "Refine features",
      "Fix identified issues",
    ],
    color: "from-yellow-500 to-amber-400",
    position: { x: 50, y: 250 },
    path: { direction: "down", length: 150 },
    moodColor: "#fcc580", // Something Feels Off
    icon: "🧪",
  },
  {
    stage: 5,
    name: "FUNDING ROUND 2",
    duration: "1 week (May 26 - June 1, 2025)",
    details: "Follow up with funding leads, update progress for investors",
    keyActions: [
      "Chase sponsorship responses",
      "Update crowdfunding",
      "Refine grant applications",
      "Network with local entrepreneurs",
    ],
    color: "from-green-600 to-teal-400",
    position: { x: 50, y: 450 },
    path: { direction: "right", length: 200 },
    moodColor: "#d9895f", // High Alert
    icon: "💸",
  },
  {
    stage: 6,
    name: "FINAL DETAILS",
    duration: "3 weeks (June 2 - June 23, 2025)",
    details:
      "Clean code/files, finish media package, tweak site, plan soft launch",
    keyActions: [
      "Optimize code",
      "Finalize media",
      "Plan beta release strategy",
      "Prepare marketing materials",
    ],
    color: "from-pink-500 to-rose-400",
    position: { x: 300, y: 450 },
    path: { direction: "down", length: 150 },
    moodColor: "#a24944", // Urgent
    icon: "🔍",
  },
  {
    stage: 7,
    name: "INVESTOR RELATIONS",
    duration: "1 week (June 23 - June 30, 2025)",
    details: "Finish details with funding plan",
    keyActions: [
      "Finalize sponsorship agreements",
      "Secure grants",
      "Prepare for donor engagement",
      "Create investor dashboard",
    ],
    color: "from-blue-600 to-indigo-400",
    position: { x: 300, y: 650 },
    path: { direction: "left", length: 200 },
    moodColor: "#4f6a8f", // Deeply Serene
    icon: "🤝",
  },
  {
    stage: 8,
    name: "BETA RELEASE",
    duration: "Ongoing (Starting July 1, 2025)",
    details: "Launch beta, gather user feedback, scale as needed",
    keyActions: [
      "Release to broader audience",
      "Monitor performance",
      "Consider secondary paid app",
      "Continuous improvement",
    ],
    color: "from-purple-600 to-pink-400",
    position: { x: 50, y: 650 },
    moodColor: "#88a2bc", // Calm and Peaceful
    icon: "🚀",
  },
];
