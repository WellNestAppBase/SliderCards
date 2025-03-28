import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const LandingPage: React.FC = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Samuel R. Erwin III",
      role: "CEO & Founder",
      bio: "Samuel founded B2GTHR with a vision to help people stay connected with their loved ones in a meaningful way. With over 15 years of experience in tech and mental health advocacy.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=samuel",
    },
    {
      name: "Meghan MacDonald",
      role: "CFO",
      bio: "Meghan brings 12 years of financial expertise from leading tech companies. Passionate about creating sustainable business models that prioritize user well-being.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=meghan",
    },
    {
      name: "Laney Reavis",
      role: "CMO, CFMP",
      bio: "Laney leads our marketing and partnership strategies with a focus on creating meaningful connections. Previously led marketing campaigns at several wellness-focused companies.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=laney",
    },
  ];

  // FAQ items
  const faqItems = [
    {
      question: "What is B2GTHR?",
      answer:
        "B2GTHR (Be Together - Better Together) is a mobile app designed to help users stay connected with loved ones by providing a quick snapshot of their well-being through a slider-based interface. It focuses on fostering meaningful connections without overwhelming users' schedules.",
    },
    {
      question: "How does the mood tracking work?",
      answer:
        "B2GTHR uses a 6-color mood scale ranging from 'Deeply Serene' to 'Urgent'. Users can select their current mood, add context, and share this with their trusted connections. The app's background color changes to reflect your current mood state.",
    },
    {
      question: "Is my data private?",
      answer:
        "Absolutely. B2GTHR gives you complete control over who can see your mood data. You can customize privacy settings for each connection and choose what information is shared with whom.",
    },
    {
      question: "What platforms is B2GTHR available on?",
      answer:
        "B2GTHR is available as a web app and mobile app for both iOS and Android. We also offer a companion widget and are developing a watch app integration.",
    },
    {
      question: "How is B2GTHR different from other social apps?",
      answer:
        "Unlike traditional social media that focuses on posts and likes, B2GTHR is designed specifically for meaningful connection with your closest circle. It prioritizes emotional well-being and provides a simple way to check in on loved ones without the noise of traditional platforms.",
    },
  ];

  // App statistics
  const appStats = [
    {
      title: "ACTIVE USERS",
      value: "25K+",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: "CONNECTIONS MADE",
      value: "120K",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      title: "MOOD UPDATES",
      value: "500K",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

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
                CONNECT MEANINGFULLY
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                B2GTHR
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl text-gray-300">
              Stay connected with your loved ones in a meaningful way. Share
              your well-being at a glance and strengthen your most important
              relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-8 py-6 text-lg rounded-md"
                >
                  GET STARTED
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-500 text-purple-400 hover:bg-purple-950/30 font-bold px-8 py-6 text-lg rounded-md"
                >
                  SIGN IN
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {appStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="text-pink-500 mr-4">{stat.icon}</div>
                <div>
                  <div className="text-sm font-semibold tracking-wider text-purple-400">
                    {stat.title}
                  </div>
                  <div className="text-4xl font-bold">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose B2GTHR Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-purple-500 mb-2"></div>
              <span className="text-pink-500 font-semibold tracking-wider">
                WHY CHOOSE US
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                BETTER
              </span>
              <span className="text-white"> TOGETHER</span>
            </h2>
            <p className="text-xl max-w-3xl text-gray-400">
              Experience a new way to stay connected with the people who matter
              most
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-pink-500/30 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">
                Meaningful Connections
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Focus on your innermost circle without the noise of traditional
                social media. B2GTHR helps you maintain deep connections with
                the people who matter most.
              </p>
            </div>

            <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Privacy-Focused</h3>
              <p className="text-gray-400 leading-relaxed">
                You control who sees your data. Customize privacy settings for
                each connection and decide exactly what information is shared
                with whom.
              </p>
            </div>

            <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Mental Well-being</h3>
              <p className="text-gray-400 leading-relaxed">
                B2GTHR is designed with mental health in mind. Track your mood
                over time, identify patterns, and get insights to improve your
                emotional well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Widget Functionality Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <div className="inline-block mb-4">
                <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mb-2"></div>
                <span className="text-blue-500 font-semibold tracking-wider">
                  STAY CONNECTED
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="text-white">WIDGET </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  FUNCTIONALITY
                </span>
              </h2>
              <p className="text-xl mb-8 text-gray-300 leading-relaxed">
                The B2GTHR widget brings your connections' well-being right to
                your home screen, allowing you to check in at a glance.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="mr-4 mt-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-lg">
                    Color-coded mood indicators for each connection
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-lg">Quick-tap to update your own mood</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-lg">
                    Urgent alerts for connections needing immediate support
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-lg">
                    One-tap contact options for quick communication
                  </p>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-2xl border border-gray-800">
              <div className="aspect-w-1 aspect-h-1 bg-black rounded-lg overflow-hidden">
                <div className="p-6 flex flex-col h-full">
                  <div className="text-sm text-purple-400 mb-4 font-semibold">
                    B2GTHR WIDGET
                  </div>
                  <div className="flex-1 flex flex-col space-y-6">
                    {/* Widget mockup content */}
                    <div className="flex items-center p-3 bg-gray-900/70 rounded-lg border border-gray-800">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 mr-4">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
                          alt="Alex"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-medium">Alex</div>
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: "#4f6a8f" }}
                          ></div>
                          <div className="text-sm text-blue-400">
                            Deeply Serene
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-900/70 rounded-lg border border-gray-800">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 mr-4">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=morgan"
                          alt="Morgan"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-medium">Morgan</div>
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: "#8eb896" }}
                          ></div>
                          <div className="text-sm text-green-400">
                            Mild/Neutral
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-900/70 rounded-lg border border-pink-800/50 shadow-lg shadow-pink-900/20">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 mr-4">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=taylor"
                          alt="Taylor"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-medium">Taylor</div>
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2 animate-pulse"
                            style={{ backgroundColor: "#a24944" }}
                          ></div>
                          <div className="text-sm text-pink-500 font-semibold">
                            Urgent
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 mb-2"></div>
              <span className="text-purple-500 font-semibold tracking-wider">
                OUR TEAM
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                MEET THE
              </span>
              <span className="text-white"> TEAM</span>
            </h2>
            <p className="text-xl max-w-3xl text-gray-400">
              The passionate individuals behind B2GTHR
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-1">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-pink-500 mb-4 font-semibold">
                  {member.role}
                </p>
                <p className="text-gray-400 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-pink-900/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 mb-2"></div>
              <span className="text-purple-500 font-semibold tracking-wider">
                GOT QUESTIONS?
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">FREQUENTLY </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                ASKED QUESTIONS
              </span>
            </h2>
            <p className="text-xl max-w-3xl text-gray-400">
              Find answers to common questions about B2GTHR
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-5">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-gradient-to-r from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800"
                >
                  <AccordionTrigger className="px-8 py-5 hover:bg-gray-900/50 transition-colors text-left font-semibold">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-5 text-gray-400 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Investment Opportunities Teaser */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-black">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block mb-4">
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-2"></div>
            <span className="text-blue-500 font-semibold tracking-wider">
              JOIN OUR MISSION
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              INVESTMENT OPPORTUNITIES
            </span>
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-400 leading-relaxed">
            Join us in revolutionizing how people connect and support each
            other's well-being. Learn about investment opportunities with
            B2GTHR.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/investment">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-6 text-lg rounded-md"
              >
                INVESTMENT DETAILS
              </Button>
            </Link>
            <Link to="/funding-schedule">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-6 text-lg rounded-md"
              >
                FUNDING SCHEDULE
              </Button>
            </Link>
            <Link to="/roadmap">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-8 py-6 text-lg rounded-md"
              >
                VIEW ROADMAP
              </Button>
            </Link>
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
                to="/login"
                className="text-gray-400 hover:text-pink-400 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-gray-400 hover:text-purple-400 transition-colors font-medium"
              >
                Sign Up
              </Link>
              <Link
                to="/investment"
                className="text-gray-400 hover:text-blue-400 transition-colors font-medium"
              >
                Investors
              </Link>
              <Link
                to="/roadmap"
                className="text-gray-400 hover:text-green-400 transition-colors font-medium"
              >
                Roadmap
              </Link>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400 transition-colors font-medium"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors font-medium"
              >
                Terms of Service
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

export default LandingPage;
