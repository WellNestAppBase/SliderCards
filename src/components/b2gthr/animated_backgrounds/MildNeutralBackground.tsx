import React, { useEffect, useRef } from "react";
import { AnimatedBackgroundProps } from ".";

export const MildNeutralBackground: React.FC<AnimatedBackgroundProps> = ({
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

    // Grass blade properties
    const grassBlades: Array<{
      x: number;
      y: number;
      height: number;
      width: number;
      swayAmplitude: number;
      swayFrequency: number;
      swayOffset: number;
      color: string;
    }> = [];

    // Create grass blades
    const createGrassBlades = () => {
      const bladeCount = Math.floor(canvas.width / 15); // More dense grass
      grassBlades.length = 0;

      // Create different shades of green for the grass
      const grassColors = [
        "#7ea886", // Base color
        "#8eb896", // Lighter
        "#9ec8a6", // Even lighter
        "#6d9775", // Darker
      ];

      for (let i = 0; i < bladeCount; i++) {
        const x = Math.random() * canvas.width;
        const height = Math.random() * 80 + 40; // Varying heights
        const width = Math.random() * 4 + 1; // Varying widths

        grassBlades.push({
          x: x,
          y: canvas.height, // Start from bottom of canvas
          height: height,
          width: width,
          swayAmplitude: Math.random() * 10 + 5, // How much it sways
          swayFrequency: Math.random() * 0.02 + 0.01, // How fast it sways
          swayOffset: Math.random() * Math.PI * 2, // Different starting positions
          color: grassColors[Math.floor(Math.random() * grassColors.length)],
        });
      }
    };

    createGrassBlades();
    window.addEventListener("resize", createGrassBlades);

    // Animation loop
    let animationFrameId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      // Clear canvas
      ctx.fillStyle = "#8eb896"; // Sage green base color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gradient sky background
      const skyGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height * 0.7,
      );
      skyGradient.addColorStop(0, "#a5d4ae"); // Lighter at top
      skyGradient.addColorStop(1, "#8eb896"); // Base color at horizon
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);

      // Draw ground gradient
      const groundGradient = ctx.createLinearGradient(
        0,
        canvas.height * 0.7,
        0,
        canvas.height,
      );
      groundGradient.addColorStop(0, "#8eb896"); // Base color at horizon
      groundGradient.addColorStop(1, "#7ea886"); // Slightly darker at bottom
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

      // Draw subtle sun
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(canvas.width * 0.8, canvas.height * 0.2, 60, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();

      // Draw distant hills
      ctx.save();
      ctx.fillStyle = "#7ea886";

      // First hill
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.7);
      ctx.bezierCurveTo(
        canvas.width * 0.25,
        canvas.height * 0.65,
        canvas.width * 0.5,
        canvas.height * 0.68,
        canvas.width,
        canvas.height * 0.7,
      );
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Second hill
      ctx.fillStyle = "#6d9775";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.75);
      ctx.bezierCurveTo(
        canvas.width * 0.3,
        canvas.height * 0.72,
        canvas.width * 0.7,
        canvas.height * 0.78,
        canvas.width,
        canvas.height * 0.75,
      );
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Draw waving grass blades
      grassBlades.forEach((blade) => {
        // Calculate sway based on time
        const sway =
          Math.sin(time * blade.swayFrequency + blade.swayOffset) *
          blade.swayAmplitude;

        // Draw a curved grass blade
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(blade.x, blade.y);

        // Control points for the curve
        const cp1x = blade.x + sway * 0.5;
        const cp1y = blade.y - blade.height * 0.5;
        const cp2x = blade.x + sway;
        const cp2y = blade.y - blade.height * 0.8;
        const endX = blade.x + sway;
        const endY = blade.y - blade.height;

        // Draw the blade as a bezier curve
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);

        ctx.lineWidth = blade.width;
        ctx.strokeStyle = blade.color;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", createGrassBlades);
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
