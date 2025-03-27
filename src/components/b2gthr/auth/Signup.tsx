import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoodOption } from "../MoodSelector";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

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

  // Use Deeply Serene mood for signup page
  const currentMood = 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // For demo purposes, just navigate to the B2GTHR app
    // In a real app, you would register with a backend
    navigate("/b2gthr");
  };

  return (
    <div
      className={`min-h-screen w-full ${moodOptions[currentMood].textClass} overflow-hidden transition-colors duration-500 flex items-center justify-center`}
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

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 shadow-xl">
        <div className="mb-6 text-center">
          <Link to="/" className="text-2xl font-bold inline-block mb-6">
            B2GTHR
          </Link>
          <h2 className="text-xl font-semibold">Create your account</h2>
          <p className="text-sm opacity-80 mt-1">
            Join B2GTHR and stay connected
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-white/10"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm">
              I agree to the{" "}
              <a href="#" className="hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-5"
          >
            Create Account
          </Button>

          <div className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
