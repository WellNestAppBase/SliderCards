import React, { useEffect, useRef } from "react";
import { AnimatedBackgroundProps } from ".";

export const SomethingOffBackground: React.FC<AnimatedBackgroundProps> = ({
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

    // Bubble properties
    const bubbles: Array<{
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
      pulseSpeed: number;
      pulsePhase: number;
    }> = [];

    // Create bubbles
    const createBubbles = () => {
      const bubbleCount = Math.floor((canvas.width * canvas.height) / 20000);
      bubbles.length = 0;

      for (let i = 0; i < bubbleCount; i++) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 30 + 10,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.3 + 0.1,
          pulseSpeed: Math.random() * 0.005 + 0.001,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    createBubbles();
    window.addEventListener("resize", createBubbles);

    // Animation loop
    let animationFrameId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      // Clear canvas
      ctx.fillStyle = "#fcc580"; // Pale peach base color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#ffd5a0"); // Lighter at top
      gradient.addColorStop(0.7, "#fcc580"); // Base color
      gradient.addColorStop(1, "#ecb570"); // Slightly darker at bottom
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle wavy lines
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = "#e0a060";

      for (let i = 0; i < 10; i++) {
        const y = (canvas.height / 10) * i;
        const amplitude = 20;
        const frequency = 0.01;
        const timeOffset = time * 0.0005;

        ctx.beginPath();
        ctx.moveTo(0, y);

        for (let x = 0; x < canvas.width; x += 5) {
          const waveY =
            y + Math.sin(x * frequency + timeOffset + i * 0.5) * amplitude;
          ctx.lineTo(x, waveY);
        }

        ctx.stroke();
      }
      ctx.restore();

      // Draw floating bubbles
      bubbles.forEach((bubble) => {
        // Update bubble position
        bubble.y -= bubble.speed;
        bubble.pulsePhase += bubble.pulseSpeed * deltaTime;

        if (bubble.pulsePhase > Math.PI * 2) {
          bubble.pulsePhase -= Math.PI * 2;
        }

        // Reset bubble if it goes off screen
        if (bubble.y < -bubble.radius) {
          bubble.y = canvas.height + bubble.radius;
          bubble.x = Math.random() * canvas.width;
        }

        // Calculate current opacity based on pulse phase
        const currentOpacity =
          bubble.opacity * (0.7 + 0.3 * Math.sin(bubble.pulsePhase));

        // Draw bubble
        ctx.save();
        ctx.globalAlpha = currentOpacity;

        // Bubble gradient
        const bubbleGradient = ctx.createRadialGradient(
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          0,
          bubble.x,
          bubble.y,
          bubble.radius,
        );
        bubbleGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        bubbleGradient.addColorStop(0.5, "rgba(255, 220, 180, 0.5)");
        bubbleGradient.addColorStop(1, "rgba(236, 181, 112, 0.1)");

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubbleGradient;
        ctx.fill();

        // Bubble highlight
        ctx.beginPath();
        ctx.arc(
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          bubble.radius * 0.2,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", createBubbles);
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
