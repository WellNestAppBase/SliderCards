import React, { useEffect, useRef } from "react";
import { AnimatedBackgroundProps } from ".";

export const CalmPeacefulBackground: React.FC<AnimatedBackgroundProps> = ({
  className = "",
  transitionProgress = 1,
  previousMoodIndex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Cloud properties
    const clouds: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
      segments: Array<{ radius: number; x: number; y: number }>;
    }> = [];

    // Create clouds
    const createClouds = () => {
      const cloudCount = Math.floor(canvas.width / 300) + 5;
      clouds.length = 0;

      for (let i = 0; i < cloudCount; i++) {
        const width = Math.random() * 200 + 100;
        const height = width * 0.6;
        const segments = [];
        const segmentCount = Math.floor(Math.random() * 3) + 3;

        for (let j = 0; j < segmentCount; j++) {
          segments.push({
            radius: Math.random() * 30 + 20,
            x: j * (width / segmentCount),
            y: Math.random() * 20 - 10,
          });
        }

        clouds.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.5),
          width,
          height,
          speed: Math.random() * 0.2 + 0.1,
          segments,
        });
      }
    };

    createClouds();
    window.addEventListener("resize", createClouds);

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#88a2bc"); // Light blue at top
      gradient.addColorStop(1, "#a8c2dc"); // Lighter blue at bottom
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw clouds
      clouds.forEach((cloud) => {
        // Move cloud
        cloud.x += cloud.speed;
        if (cloud.x > canvas.width + cloud.width) {
          cloud.x = -cloud.width;
        }

        // Draw cloud segments
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";

        // Create cloud shape using multiple circles
        ctx.beginPath();
        cloud.segments.forEach((segment) => {
          ctx.moveTo(cloud.x + segment.x + segment.radius, cloud.y + segment.y);
          ctx.arc(
            cloud.x + segment.x,
            cloud.y + segment.y,
            segment.radius,
            0,
            Math.PI * 2,
          );
        });
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", createClouds);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full -z-10 transition-opacity duration-700 ${className}`}
      style={{ opacity: transitionProgress }}
    />
  );
};
