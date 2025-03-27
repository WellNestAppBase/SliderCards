import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardContentProps {
  title: string;
  children: ReactNode;
  showFooter?: boolean;
  compact?: boolean;
}

const CardContent: React.FC<CardContentProps> = ({
  title,
  children,
  showFooter = false,
  compact = true,
}) => {
  // Get card style with a subtle glow
  const getCardStyle = () => {
    return {
      background: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(8px)",
      borderRadius: "12px",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: `0 0 15px rgba(255, 255, 255, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)`,
      transition: "background 0.5s ease, box-shadow 0.5s ease",
    };
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center h-full ${compact ? "p-0.5" : "p-1"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`card-content w-full mx-auto ${compact ? "p-1.5" : "p-2"} relative overflow-auto flex flex-col`}
        style={getCardStyle()}
      >
        {/* Card Header - Swipe Area */}
        <div
          className={`${compact ? "mb-0.5 pb-0.5" : "mb-1 pb-1"} border-b border-white/10`}
        >
          {/* Title removed to prevent duplication */}
        </div>

        {/* Card Content */}
        <div className="flex-grow overflow-auto">{children}</div>

        {/* Card Footer - Optional */}
        {showFooter && (
          <div
            className={`mt-auto ${compact ? "pt-1" : "pt-2"} border-t border-white/10`}
          >
            <div className="text-sm text-center opacity-70">
              Swipe or use arrow keys to navigate
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CardContent;
