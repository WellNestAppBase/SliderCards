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
  // Get card style with enhanced visual effects
  const getCardStyle = () => {
    return {
      background: "rgba(0, 0, 0, 0.45)",
      backdropFilter: "blur(10px)",
      borderRadius: "14px",
      border: "1px solid rgba(255, 255, 255, 0.35)",
      boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 255, 255, 0.2), inset 0 0 25px rgba(255, 255, 255, 0.08)`,
      transition: "all 0.5s ease",
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
        className={`card-content w-full mx-auto ${compact ? "p-2" : "p-3"} relative overflow-auto flex flex-col shadow-lg`}
        style={getCardStyle()}
      >
        {/* Card Header - Swipe Area */}
        <div
          className={`${compact ? "mb-1 pb-1" : "mb-2 pb-2"} border-b border-white/20`}
        >
          {/* Title removed to prevent duplication */}
        </div>

        {/* Card Content */}
        <div className="flex-grow overflow-auto px-1">{children}</div>

        {/* Card Footer - Optional */}
        {showFooter && (
          <div
            className={`mt-auto ${compact ? "pt-1.5" : "pt-2.5"} border-t border-white/20`}
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
