import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoodOption } from "../MoodSelector";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, error, loading, clearError } = useAuth();

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

  // Use Calm and Peaceful mood for forgot password page
  const currentMood = 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Basic validation
    if (!email) {
      return;
    }

    await resetPassword(email);
    setIsSubmitted(true);
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

      {/* Forgot Password Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 shadow-xl">
        <div className="mb-6 text-center">
          <Link to="/" className="text-2xl font-bold inline-block mb-6">
            B2GTHR
          </Link>
          <h2 className="text-xl font-semibold">
            {isSubmitted ? "Check your email" : "Reset your password"}
          </h2>
          <p className="text-sm opacity-80 mt-1">
            {isSubmitted
              ? "We've sent you instructions to reset your password"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-sm">
            {error.message}
          </div>
        )}

        {!isSubmitted ? (
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

            <Button
              type="submit"
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-5"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center text-sm mt-4">
              Remember your password?{" "}
              <Link to="/login" className="hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-center mb-4">
              If an account exists with the email {email}, you'll receive
              instructions to reset your password shortly.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-5"
            >
              Try another email
            </Button>
            <div className="text-center text-sm mt-4">
              <Link to="/login" className="hover:underline font-medium">
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
