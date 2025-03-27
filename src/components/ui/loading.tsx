import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const Loading = ({
  size = "md",
  color = "cyan",
  text = "Loading...",
  fullScreen = false,
}: LoadingProps) => {
  // Size mapping
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  // Color mapping
  const colorMap: Record<string, string> = {
    cyan: "border-cyan-500",
    blue: "border-blue-500",
    purple: "border-purple-500",
    green: "border-green-500",
    red: "border-red-500",
    yellow: "border-yellow-500",
    white: "border-white",
    gray: "border-gray-500",
  };

  const borderColor = colorMap[color] || "border-cyan-500";
  const spinnerSize = sizeMap[size] || "h-8 w-8";
  const textSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }[size];

  const LoadingContent = () => (
    <div className="text-center">
      <div
        className={`inline-block ${spinnerSize} animate-spin rounded-full border-4 border-solid ${borderColor} border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      ></div>
      {text && <p className={`mt-4 ${textSize}`}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
        <LoadingContent />
      </div>
    );
  }

  return <LoadingContent />;
};

export default Loading;
