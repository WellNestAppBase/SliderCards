import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { motion } from "framer-motion";

const FundingSchedule: React.FC = () => {
  // Funding phases data
  const fundingPhases = [
    {
      phase: "Seed Round",
      timeline: "Q3 2023 - Q1 2024",
      goal: 500000,
      current: 425000,
      description:
        "Initial funding to support beta launch and early user acquisition",
      milestones: [
        "Beta launch with core functionality",
        "Onboard 5,000 beta users",
        "Establish initial team structure",
        "Develop MVP for mobile platforms",
      ],
      color: "from-pink-500 to-purple-500",
      sponsors: [
        "Wellness Concepts Clinic",
        "James River Church",
        "Community Foundation of the Ozarks",
      ],
    },
    {
      phase: "Series A",
      timeline: "Q2 2024 - Q4 2024",
      goal: 2000000,
      current: 750000,
      description:
        "Expansion funding to scale user base and enhance platform features",
      milestones: [
        "Public launch with full feature set",
        "Reach 50,000 active users",
        "Launch premium subscription model",
        "Expand development team",
      ],
      color: "from-purple-500 to-blue-500",
      sponsors: [
        "TechVentures Capital",
        "Mental Health Innovation Fund",
        "Angel Investor Consortium",
      ],
    },
    {
      phase: "Series B",
      timeline: "Q1 2025 - Q3 2025",
      goal: 5000000,
      current: 0,
      description:
        "Growth funding to establish B2B partnerships and international expansion",
      milestones: [
        "Launch enterprise solutions",
        "Secure 5 major B2B partnerships",
        "Begin international expansion",
        "Reach 500,000 active users worldwide",
      ],
      color: "from-blue-500 to-cyan-500",
      sponsors: [
        "Horizon Ventures",
        "Global Health Tech Fund",
        "Corporate Wellness Partners",
      ],
    },
    {
      phase: "Local Sponsorships",
      timeline: "April 2025 - Ongoing",
      goal: 36000,
      current: 12000,
      description:
        "Ongoing local sponsorships to support development and community engagement",
      milestones: [
        "Secure 10 local sponsors in Springfield, MO",
        "Establish community wellness program",
        "Host monthly mental health awareness events",
        "Create local support network",
      ],
      color: "from-green-500 to-emerald-500",
      sponsors: [
        "Springfield Regional Hospital",
        "Missouri Mental Health Foundation",
        "Local Business Alliance",
      ],
    },
  ];

  // Investment goals data
  const [investmentGoals, setInvestmentGoals] = useState([
    {
      name: "Platform Development",
      allocation: 40,
      description:
        "Core technology development, feature enhancements, and platform stability",
      details: [
        "React-based carousel interface development",
        "Real-time mood tracking with Supabase",
        "Cross-platform compatibility (web, mobile, widget)",
        "Security and privacy infrastructure",
      ],
    },
    {
      name: "Marketing & User Acquisition",
      allocation: 30,
      description:
        "User growth strategies, marketing campaigns, and brand development",
      details: [
        "Community outreach in Springfield, MO",
        "Social media campaigns on X and Facebook",
        "Mental health awareness partnerships",
        "Referral program development",
      ],
    },
    {
      name: "Operations & Team",
      allocation: 20,
      description:
        "Team expansion, office space, and operational infrastructure",
      details: [
        "Developer hiring and onboarding",
        "Remote work infrastructure",
        "Project management tools",
        "Legal and compliance resources",
      ],
    },
    {
      name: "Research & Innovation",
      allocation: 10,
      description:
        "New feature research, mental health partnerships, and innovation initiatives",
      details: [
        "Advanced mood analytics research",
        "Mental health professional consultations",
        "User experience testing",
        "New feature prototyping",
      ],
    },
  ]);

  // Monthly growth metrics
  const monthlyGrowth = [
    { month: "Jan", users: 5000, revenue: 10000, sponsors: 2 },
    { month: "Feb", users: 7500, revenue: 15000, sponsors: 3 },
    { month: "Mar", users: 12000, revenue: 24000, sponsors: 3 },
    { month: "Apr", users: 18000, revenue: 36000, sponsors: 4 },
    { month: "May", users: 25000, revenue: 50000, sponsors: 5 },
    { month: "Jun", users: 35000, revenue: 70000, sponsors: 6 },
    { month: "Jul", users: 42000, revenue: 84000, sponsors: 7 },
    { month: "Aug", users: 48000, revenue: 96000, sponsors: 8 },
    { month: "Sep", users: 52000, revenue: 104000, sponsors: 9 },
    { month: "Oct", users: 58000, revenue: 116000, sponsors: 10 },
    { month: "Nov", users: 65000, revenue: 130000, sponsors: 12 },
    { month: "Dec", users: 75000, revenue: 150000, sponsors: 15 },
  ];

  // Funding sources breakdown
  const fundingSources = [
    { source: "Local Sponsorships", amount: 36000, percentage: 15 },
    { source: "Angel Investors", amount: 120000, percentage: 50 },
    { source: "Grants", amount: 60000, percentage: 25 },
    { source: "Crowdfunding", amount: 24000, percentage: 10 },
  ];

  // Calculate total funding and progress
  const totalGoal = fundingPhases.reduce((sum, phase) => sum + phase.goal, 0);
  const totalCurrent = fundingPhases.reduce(
    (sum, phase) => sum + phase.current,
    0,
  );
  const overallProgress = (totalCurrent / totalGoal) * 100;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 blur-[150px] max-w-5xl h-[750px] mx-auto z-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(59, 130, 246, 0.1) 100%)",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-purple-500 mb-2"></div>
              <span className="text-pink-500 font-semibold tracking-wider">
                FUNDING JOURNEY
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              <span className="text-white">BUILDING </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                B2GTHR
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl text-gray-300">
              Our planned schedule for funding and implementing B2GTHR, bringing
              meaningful connections to everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/investment">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-500 text-purple-400 hover:bg-purple-950/30 font-bold px-8 py-6 text-lg rounded-md"
                >
                  BACK TO INVESTMENT
                </Button>
              </Link>
              <Link to="/roadmap">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-pink-500 text-pink-400 hover:bg-pink-950/30 font-bold px-8 py-6 text-lg rounded-md"
                >
                  VIEW ROADMAP
                </Button>
              </Link>
              <Link to="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-500 text-blue-400 hover:bg-blue-950/30 font-bold px-8 py-6 text-lg rounded-md"
                >
                  HOME
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overall Progress Section */}
      <section className="py-16 bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8">
              Overall Funding Progress
            </h2>
            <div className="w-full max-w-3xl mb-4">
              <Progress value={overallProgress} className="h-4 bg-gray-800" />
            </div>
            <div className="flex justify-between w-full max-w-3xl">
              <span className="text-gray-400">
                ${totalCurrent.toLocaleString()}
              </span>
              <span className="text-pink-500 font-semibold">
                {overallProgress.toFixed(1)}%
              </span>
              <span className="text-gray-400">
                ${totalGoal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Funding Phases Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-purple-500 mb-2"></div>
              <span className="text-pink-500 font-semibold tracking-wider">
                FUNDING ROADMAP
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                INVESTMENT
              </span>
              <span className="text-white"> PHASES</span>
            </h2>
            <p className="text-xl max-w-3xl text-gray-400">
              Our strategic approach to funding and growth
            </p>
          </div>

          <div className="space-y-16">
            {fundingPhases.map((phase, index) => {
              const progress = (phase.current / phase.goal) * 100;
              return (
                <div key={index} className="relative">
                  {/* Timeline connector */}
                  {index < fundingPhases.length - 1 && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-16 w-1 bg-gray-800 top-full"></div>
                  )}

                  <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3">
                        <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                          <span className="text-white font-bold text-xl">
                            {index + 1}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                          {phase.phase}
                        </h3>
                        <p className="text-purple-400 mb-4">{phase.timeline}</p>
                        <p className="text-gray-400 mb-6">
                          {phase.description}
                        </p>
                        <div className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span>${phase.current.toLocaleString()}</span>
                            <span className="text-pink-500">
                              {progress.toFixed(1)}%
                            </span>
                            <span>${phase.goal.toLocaleString()}</span>
                          </div>
                          <Progress
                            value={progress}
                            className={`h-3 bg-gray-800 bg-gradient-to-r ${phase.color}`}
                          />
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <h4 className="text-xl font-semibold mb-4">
                          Key Milestones
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {phase.milestones.map((milestone, i) => (
                            <div
                              key={i}
                              className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                            >
                              <div className="flex items-start">
                                <div className="mr-3 mt-1 text-pink-400">•</div>
                                <p>{milestone}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {phase.sponsors && phase.sponsors.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-xl font-semibold mb-4">
                              Key Sponsors
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {phase.sponsors.map((sponsor, i) => (
                                <span
                                  key={i}
                                  className="bg-gray-800/80 text-sm px-3 py-1 rounded-full border border-gray-700"
                                >
                                  {sponsor}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Animated Growth Chart Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mb-2"></div>
              <span className="text-blue-500 font-semibold tracking-wider">
                GROWTH METRICS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">PROJECTED </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                GROWTH
              </span>
            </h2>
            <p className="text-xl max-w-3xl text-gray-400">
              Anticipated user growth and revenue for the first year
            </p>
          </div>

          <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800">
            <div className="h-80 relative">
              {/* Chart Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-gray-500 text-sm">
                <span>75K</span>
                <span>50K</span>
                <span>25K</span>
                <span>0</span>
              </div>

              {/* Chart grid lines */}
              <div className="absolute left-16 right-0 top-0 bottom-0">
                <div className="border-t border-gray-800 absolute top-0 left-0 right-0"></div>
                <div className="border-t border-gray-800 absolute top-1/3 left-0 right-0"></div>
                <div className="border-t border-gray-800 absolute top-2/3 left-0 right-0"></div>
                <div className="border-t border-gray-800 absolute bottom-0 left-0 right-0"></div>
              </div>

              {/* Chart bars */}
              <div className="absolute left-16 right-0 top-0 bottom-0 flex items-end justify-between">
                {monthlyGrowth.map((data, index) => {
                  const userHeight = (data.users / 75000) * 100;
                  const revenueHeight = (data.revenue / 150000) * 100;
                  const sponsorHeight = (data.sponsors / 15) * 100;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center w-full"
                    >
                      <div className="relative h-full w-20 flex items-end justify-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${userHeight}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="w-4 bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-sm"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${revenueHeight}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          className="w-4 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm mx-1"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${sponsorHeight}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.6 }}
                          className="w-4 bg-gradient-to-t from-green-600 to-emerald-400 rounded-t-sm"
                        />
                      </div>
                      <span className="text-xs text-gray-500 mt-2">
                        {data.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-8">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gradient-to-t from-purple-600 to-pink-500 mr-2"></div>
                <span>Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gradient-to-t from-blue-600 to-cyan-400 mr-2"></div>
                <span>Revenue ($)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gradient-to-t from-green-600 to-emerald-400 mr-2"></div>
                <span>Sponsors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Allocation Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 mb-2"></div>
              <span className="text-purple-500 font-semibold tracking-wider">
                FUND ALLOCATION
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                INVESTMENT
              </span>
              <span className="text-white"> GOALS</span>
            </h2>
            <p className="text-xl max-w-3xl text-gray-400">
              How we plan to allocate investment funds
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Allocation chart */}
            <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Allocation Breakdown
              </h3>
              <div className="relative w-full aspect-square">
                {investmentGoals.map((goal, index) => {
                  // Calculate the segment position in the pie chart
                  let previousTotal = 0;
                  for (let i = 0; i < index; i++) {
                    previousTotal += investmentGoals[i].allocation;
                  }
                  const startAngle = (previousTotal / 100) * 360;
                  const endAngle =
                    ((previousTotal + goal.allocation) / 100) * 360;
                  const largeArcFlag = goal.allocation > 50 ? 1 : 0;

                  // Calculate coordinates on the circle
                  const startX =
                    50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
                  const startY =
                    50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
                  const endX =
                    50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180));
                  const endY =
                    50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180));

                  // Colors for each segment
                  const colors = [
                    "#ec4899", // pink-500
                    "#8b5cf6", // purple-500
                    "#3b82f6", // blue-500
                    "#06b6d4", // cyan-500
                  ];

                  return (
                    <motion.path
                      key={index}
                      d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                      fill={colors[index % colors.length]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className="hover:opacity-90 transition-opacity"
                    />
                  );
                })}
                <circle cx="50" cy="50" r="20" fill="#121212" />
              </div>

              <div className="mt-8 space-y-2">
                {investmentGoals.map((goal, index) => {
                  const colors = [
                    "bg-pink-500",
                    "bg-purple-500",
                    "bg-blue-500",
                    "bg-cyan-500",
                  ];

                  return (
                    <div key={index} className="flex items-center">
                      <div
                        className={`w-4 h-4 ${colors[index % colors.length]} mr-3 rounded-sm`}
                      ></div>
                      <span className="flex-1">{goal.name}</span>
                      <span className="font-semibold">{goal.allocation}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Allocation details */}
            <div className="space-y-6">
              {investmentGoals.map((goal, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 hover:border-purple-500/30 transition-all duration-300"
                >
                  <h4 className="text-xl font-bold mb-2">{goal.name}</h4>
                  <div className="flex items-center mb-4">
                    <div className="flex-1">
                      <Progress
                        value={goal.allocation}
                        className="h-2 bg-gray-800"
                      />
                    </div>
                    <span className="ml-4 text-pink-500 font-semibold">
                      {goal.allocation}%
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4">{goal.description}</p>
                  <div className="space-y-2 mt-4">
                    {goal.details.map((detail, i) => (
                      <div key={i} className="flex items-start">
                        <div className="mr-3 mt-1 text-pink-400">•</div>
                        <p className="text-sm text-gray-300">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Funding Sources Section */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-black/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 mb-2"></div>
              <span className="text-green-500 font-semibold tracking-wider">
                FUNDING SOURCES
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-500">
                CAPITAL
              </span>
              <span className="text-white"> BREAKDOWN</span>
            </h2>
            <p className="text-xl max-w-3xl text-gray-400">
              Our diverse funding approach ensures sustainable growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Funding sources chart */}
            <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Funding Sources
              </h3>

              <div className="space-y-6">
                {fundingSources.map((source, index) => (
                  <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{source.source}</h4>
                      <div className="flex items-center">
                        <span className="text-green-400 font-bold mr-2">
                          ${source.amount.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-sm">
                          ({source.percentage}%)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={source.percentage}
                      className="h-2 bg-gray-700"
                      indicatorClassName={
                        index === 0
                          ? "bg-green-500"
                          : index === 1
                            ? "bg-blue-500"
                            : index === 2
                              ? "bg-purple-500"
                              : "bg-pink-500"
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                <h4 className="font-semibold mb-2">
                  Total Annual Funding Goal
                </h4>
                <div className="text-3xl font-bold text-green-400">
                  $240,000
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Projected annual funding needed to support development and
                  operations
                </p>
              </div>
            </div>

            {/* Funding strategy */}
            <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800">
              <h3 className="text-2xl font-bold mb-6">Funding Strategy</h3>

              <div className="space-y-6">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-2">
                    Local Sponsorships
                  </h4>
                  <p className="text-gray-300 mb-3">
                    Partnerships with local businesses and organizations in
                    Springfield, MO that align with our mission of mental health
                    and community connection.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-700 text-xs px-2 py-1 rounded">
                      Wellness Concepts Clinic
                    </span>
                    <span className="bg-gray-700 text-xs px-2 py-1 rounded">
                      James River Church
                    </span>
                    <span className="bg-gray-700 text-xs px-2 py-1 rounded">
                      Community Foundation of the Ozarks
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-400 mb-2">
                    Grants & Foundations
                  </h4>
                  <p className="text-gray-300 mb-3">
                    Applications to mental health innovation grants and
                    community support foundations to fund development without
                    equity dilution.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-700 text-xs px-2 py-1 rounded">
                      Mental Health Innovation Fund
                    </span>
                    <span className="bg-gray-700 text-xs px-2 py-1 rounded">
                      Missouri Mental Health Foundation
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-400 mb-2">
                    Crowdfunding
                  </h4>
                  <p className="text-gray-300 mb-3">
                    Community-based funding through platforms like GoFundMe to
                    build early user base and generate awareness.
                  </p>
                  <div className="mt-2">
                    <Progress value={40} className="h-2 bg-gray-700" />
                    <div className="flex justify-between text-xs mt-1">
                      <span>$9,600 raised</span>
                      <span>$24,000 goal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Investment Updates Section */}
      <section className="py-24 bg-black/90">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mb-2"></div>
              <span className="text-blue-500 font-semibold tracking-wider">
                LATEST UPDATES
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">NEW </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                INVESTMENTS
              </span>
            </h2>
            <p className="text-xl max-w-3xl text-gray-400">
              Recent funding activities and upcoming opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-all duration-300">
              <div className="text-blue-400 text-sm font-semibold mb-2">
                APRIL 28, 2025
              </div>
              <h3 className="text-xl font-bold mb-3">
                Springfield Regional Hospital Partnership
              </h3>
              <p className="text-gray-300 mb-4">
                New sponsorship agreement with Springfield Regional Hospital to
                support mental health awareness initiatives through the B2GTHR
                platform.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-green-400 font-bold">$5,000</span>
                <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
              <div className="text-purple-400 text-sm font-semibold mb-2">
                MAY 15, 2025
              </div>
              <h3 className="text-xl font-bold mb-3">
                Mental Health Innovation Grant
              </h3>
              <p className="text-gray-300 mb-4">
                Application submitted for the Mental Health Innovation Grant to
                fund the development of advanced mood analytics features.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400 font-bold">$25,000</span>
                <span className="bg-yellow-900/30 text-yellow-400 text-xs px-2 py-1 rounded-full">
                  Pending
                </span>
              </div>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 hover:border-pink-500/30 transition-all duration-300">
              <div className="text-pink-400 text-sm font-semibold mb-2">
                JUNE 1, 2025
              </div>
              <h3 className="text-xl font-bold mb-3">
                Community Crowdfunding Campaign
              </h3>
              <p className="text-gray-300 mb-4">
                Launch of GoFundMe campaign to support the development of the
                B2GTHR mobile app and widget features.
              </p>
              <div className="flex flex-col gap-2">
                <Progress value={40} className="h-2 bg-gray-800" />
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">$9,600 raised</span>
                  <span className="text-pink-400">$24,000 goal</span>
                </div>
                <Button
                  size="sm"
                  className="mt-2 bg-pink-600 hover:bg-pink-500 text-white w-full"
                >
                  View Campaign
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-b from-black to-black">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block mb-4">
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-2"></div>
            <span className="text-blue-500 font-semibold tracking-wider">
              JOIN OUR JOURNEY
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              BECOME AN INVESTOR
            </span>
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-400 leading-relaxed">
            Join us in revolutionizing how people connect and support each
            other's well-being. Contact our team to discuss investment
            opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/investment">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-6 text-lg rounded-md"
              >
                INVESTMENT OPPORTUNITIES
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-green-500 text-green-400 hover:bg-green-950/30 font-bold px-8 py-6 text-lg rounded-md"
            >
              SCHEDULE A CALL
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-2">
                B2GTHR
              </h2>
              <p className="text-gray-500 font-medium">Better Together</p>
            </div>
            <div className="flex flex-wrap gap-10">
              <Link
                to="/"
                className="text-gray-400 hover:text-pink-400 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/investment"
                className="text-gray-400 hover:text-purple-400 transition-colors font-medium"
              >
                Investment
              </Link>
              <Link
                to="/login"
                className="text-gray-400 hover:text-blue-400 transition-colors font-medium"
              >
                Sign In
              </Link>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400 transition-colors font-medium"
              >
                Privacy Policy
              </a>
            </div>
          </div>
          <Separator className="my-10 bg-gray-900" />
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} B2GTHR. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FundingSchedule;
