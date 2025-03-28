import React, { useEffect, useRef } from "react";
import { AnimatedBackgroundProps } from ".";

export const DeeplySereneBackground: React.FC<AnimatedBackgroundProps> = ({
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

    // Star properties
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      brightness: number;
      speed: number;
      twinkleSpeed: number;
      twinklePhase: number;
    }> = [];

    // Create stars
    const createStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 1000);
      stars.length = 0;

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          brightness: Math.random() * 0.5 + 0.5,
          speed: Math.random() * 0.05 + 0.01,
          twinkleSpeed: Math.random() * 0.01 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    createStars();
    window.addEventListener("resize", createStars);

    // Animation loop
    let animationFrameId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      // Clear canvas
      ctx.fillStyle = "#1a2a3f"; // Deep blue base color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0f1a2a"); // Darker at top
      gradient.addColorStop(0.5, "#2a3a4f"); // Midtone
      gradient.addColorStop(1, "#1a2a3f"); // Base color at bottom
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        // Update twinkle phase
        star.twinklePhase += star.twinkleSpeed * deltaTime;
        if (star.twinklePhase > Math.PI * 2) {
          star.twinklePhase -= Math.PI * 2;
        }

        // Calculate current brightness based on twinkle phase
        const currentBrightness =
          star.brightness * (0.5 + 0.5 * Math.sin(star.twinklePhase));

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentBrightness})`;
        ctx.fill();

        // Add glow effect for brighter stars
        if (star.radius > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 220, 255, ${currentBrightness * 0.2})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", createStars);
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
