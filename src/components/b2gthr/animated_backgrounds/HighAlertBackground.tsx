import React, { useEffect, useRef } from "react";
import { AnimatedBackgroundProps } from ".";

export const HighAlertBackground: React.FC<AnimatedBackgroundProps> = ({
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

    // Ember properties
    const embers: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      flickerSpeed: number;
      flickerPhase: number;
    }> = [];

    // Create embers
    const createEmbers = () => {
      const emberCount = Math.floor((canvas.width * canvas.height) / 15000);
      embers.length = 0;

      for (let i = 0; i < emberCount; i++) {
        embers.push({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * 100,
          size: Math.random() * 6 + 2,
          speed: Math.random() * 1 + 0.5,
          opacity: Math.random() * 0.7 + 0.3,
          flickerSpeed: Math.random() * 0.01 + 0.005,
          flickerPhase: Math.random() * Math.PI * 2,
        });
      }
    };

    createEmbers();
    window.addEventListener("resize", createEmbers);

    // Animation loop
    let animationFrameId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      // Clear canvas
      ctx.fillStyle = "#d9895f"; // Terracotta base color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#e9996f"); // Lighter at top
      gradient.addColorStop(0.5, "#d9895f"); // Base color
      gradient.addColorStop(1, "#c9794f"); // Darker at bottom
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw heat waves
      ctx.save();
      ctx.globalAlpha = 0.1;

      for (let i = 0; i < 5; i++) {
        const y = canvas.height - (canvas.height / 5) * i;
        const amplitude = 10 + i * 5;
        const frequency = 0.01;
        const timeOffset = time * 0.001;

        ctx.beginPath();
        ctx.moveTo(0, y);

        for (let x = 0; x < canvas.width; x += 5) {
          const waveY =
            y + Math.sin(x * frequency + timeOffset + i * 0.5) * amplitude;
          ctx.lineTo(x, waveY);
        }

        ctx.strokeStyle = `rgba(255, ${150 - i * 20}, ${100 - i * 20}, 0.3)`;
        ctx.lineWidth = 5 + i;
        ctx.stroke();
      }
      ctx.restore();

      // Draw rising embers
      embers.forEach((ember) => {
        // Update ember position
        ember.y -= ember.speed;
        ember.x += (Math.random() - 0.5) * 2; // Slight horizontal drift
        ember.flickerPhase += ember.flickerSpeed * deltaTime;

        if (ember.flickerPhase > Math.PI * 2) {
          ember.flickerPhase -= Math.PI * 2;
        }

        // Reset ember if it goes off screen
        if (ember.y < -ember.size) {
          ember.y = canvas.height + ember.size;
          ember.x = Math.random() * canvas.width;
        }

        // Calculate current opacity based on flicker phase
        const currentOpacity =
          ember.opacity * (0.7 + 0.3 * Math.sin(ember.flickerPhase));

        // Draw ember
        ctx.save();
        ctx.globalAlpha = currentOpacity;

        // Ember gradient
        const emberGradient = ctx.createRadialGradient(
          ember.x,
          ember.y,
          0,
          ember.x,
          ember.y,
          ember.size,
        );
        emberGradient.addColorStop(0, "rgba(255, 255, 200, 0.9)");
        emberGradient.addColorStop(0.5, "rgba(255, 150, 50, 0.7)");
        emberGradient.addColorStop(1, "rgba(200, 50, 0, 0)");

        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fillStyle = emberGradient;
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", createEmbers);
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
