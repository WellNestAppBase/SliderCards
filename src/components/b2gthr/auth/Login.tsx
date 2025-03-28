import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoodOption } from "../MoodSelector";
import { useAuth } from "@/contexts/AuthContext";

const Login: React.FC = () => {
  const { signIn, error: authError, loading, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  // Clear errors when component mounts or unmounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

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

  // Use Calm and Peaceful mood for login page
  const currentMood = 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError("");

    // Basic validation
    if (!email || !password) {
      setValidationError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    // Authenticate with Supabase
    await signIn(email, password);
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

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 shadow-xl">
        <div className="mb-6 text-center">
          <Link to="/" className="text-2xl font-bold inline-block mb-6">
            B2GTHR
          </Link>
          <h2 className="text-xl font-semibold">Welcome back</h2>
          <p className="text-sm opacity-80 mt-1">Sign in to your account</p>
        </div>

        {(validationError || authError) && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-sm">
            {validationError || authError?.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-white/10"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link to="/forgot-password" className="hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-5"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
