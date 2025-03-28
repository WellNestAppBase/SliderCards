import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoodOption } from "../MoodSelector";
import { useAuth } from "@/contexts/AuthContext";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { updatePassword, loading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the reset token in the URL
    const hash = window.location.hash;
    if (!hash || !hash.includes("type=recovery")) {
      setError("Invalid or expired password reset link");
    }

    // Extract the access_token from the URL hash if present
    // This will be used by the updatePassword function
    if (hash) {
      try {
        // The hash typically looks like #access_token=xxx&refresh_token=xxx&type=recovery
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        if (!accessToken) {
          setError("Invalid password reset link. Missing access token.");
        }
      } catch (err) {
        console.error("Error parsing reset token:", err);
        setError("Invalid password reset link format.");
      }
    }
  }, []);

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

  // Use Deeply Serene mood for reset password page
  const currentMood = 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setError("");

    // Basic validation
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      // The updatePassword function will use the access_token from the URL hash
      // which is automatically handled by the Supabase client in the auth service
      const { error } = await updatePassword(password);

      if (error) {
        setError(
          error.message || "Failed to reset password. Please try again.",
        );
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("An unexpected error occurred. Please try again.");
    }
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

      {/* Reset Password Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 shadow-xl">
        <div className="mb-6 text-center">
          <Link to="/" className="text-2xl font-bold inline-block mb-6">
            B2GTHR
          </Link>
          <h2 className="text-xl font-semibold">
            {isSuccess ? "Password Reset Successful" : "Reset Your Password"}
          </h2>
          <p className="text-sm opacity-80 mt-1">
            {isSuccess
              ? "You can now log in with your new password"
              : "Create a new password for your account"}
          </p>
        </div>

        {(error || authError) && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-sm">
            {error || authError?.message}
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-md text-center">
              <p>Password has been reset successfully!</p>
              <p className="text-sm mt-2">Redirecting to login page...</p>
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-5"
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                New Password
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

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium mb-1"
              >
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-5"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            <div className="text-center text-sm mt-4">
              <Link to="/login" className="hover:underline font-medium">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
