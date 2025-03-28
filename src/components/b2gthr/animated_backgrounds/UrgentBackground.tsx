import React, { useEffect, useRef, useState } from "react";
import { AnimatedBackgroundProps } from ".";

export const UrgentBackground: React.FC<AnimatedBackgroundProps> = ({
  className = "",
  transitionProgress = 1,
  previousMoodIndex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomProgress, setZoomProgress] = useState(0);

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
      size: number;
      brightness: number;
      twinkleSpeed: number;
      twinkleOffset: number;
    }> = [];

    // Campfire properties
    const campfireX = canvas.width / 2;
    const campfireY = canvas.height * 0.85; // Position near bottom
    const logWidth = 60;
    const logHeight = 15;
    const flameParticles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      life: number;
      maxLife: number;
      color: string;
    }> = [];

    // People sitting around campfire
    const people: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      angle: number;
      distance: number;
      bobSpeed: number;
      bobOffset: number;
    }> = [];

    // Create people sitting around the campfire
    const createPeople = () => {
      people.length = 0;
      const peopleCount = 5; // Number of people around the fire

      for (let i = 0; i < peopleCount; i++) {
        const angle = (i / peopleCount) * Math.PI * 2;
        const distance = 80 + Math.random() * 20; // Distance from fire

        people.push({
          x: campfireX + Math.cos(angle) * distance,
          y: campfireY + Math.sin(angle) * distance * 0.5, // Elliptical arrangement
          size: 20 + Math.random() * 5, // Person size
          color: `hsl(${20 + Math.random() * 20}, 70%, ${20 + Math.random() * 10}%)`, // Varied skin/clothing tones
          angle: angle,
          distance: distance,
          bobSpeed: 0.001 + Math.random() * 0.001, // Subtle movement speed
          bobOffset: Math.random() * Math.PI * 2, // Random starting phase
        });
      }
    };

    // Create stars
    const createStars = () => {
      stars.length = 0;
      const starCount = Math.floor((canvas.width * canvas.height) / 1000);

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          brightness: Math.random() * 0.5 + 0.5,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    // Create flame particles
    const createFlameParticle = () => {
      const hue = Math.floor(Math.random() * 30) + 10; // Orange-red range
      const saturation = Math.floor(Math.random() * 20) + 80; // High saturation
      const lightness = Math.floor(Math.random() * 20) + 50; // Medium-high lightness

      flameParticles.push({
        x: campfireX + (Math.random() - 0.5) * 20,
        y: campfireY - 10,
        size: Math.random() * 8 + 4,
        speed: Math.random() * 2 + 1,
        life: 0,
        maxLife: Math.random() * 60 + 30,
        color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      });
    };

    createStars();
    createPeople();
    window.addEventListener("resize", createStars);
    window.addEventListener("resize", createPeople);

    // Start zoom animation
    let zoomStartTime = Date.now();
    const zoomDuration = 10000; // 10 seconds for full zoom

    // Animation loop
    let animationFrameId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      // Calculate zoom progress (0 to 1)
      const currentTime = Date.now();
      const elapsed = currentTime - zoomStartTime;
      const newZoomProgress = Math.min(elapsed / zoomDuration, 1);
      setZoomProgress(newZoomProgress);

      // Clear canvas with dark blue background
      const backgroundGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height,
      );
      backgroundGradient.addColorStop(0, "#0a0a20"); // Dark blue at top
      backgroundGradient.addColorStop(1, "#3a1010"); // Dark red at bottom

      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars with twinkle effect
      ctx.save();
      stars.forEach((star) => {
        // Calculate star position based on zoom
        const zoomFactor = 1 + newZoomProgress * 3;
        const zoomedX =
          (star.x - canvas.width / 2) * zoomFactor + canvas.width / 2;
        const zoomedY = (star.y - campfireY) * zoomFactor + campfireY;

        // Only draw stars that are still in view
        if (
          zoomedX > 0 &&
          zoomedX < canvas.width &&
          zoomedY > 0 &&
          zoomedY < canvas.height
        ) {
          // Calculate twinkle effect
          const twinkle =
            Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.2 + 0.8;

          ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle})`;
          ctx.beginPath();
          ctx.arc(zoomedX, zoomedY, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();

      // Draw ground when zoom progress is sufficient
      if (newZoomProgress > 0.5) {
        const groundVisibility = (newZoomProgress - 0.5) * 2; // 0 to 1

        // Draw ground
        const groundGradient = ctx.createLinearGradient(
          0,
          canvas.height * 0.8,
          0,
          canvas.height,
        );
        groundGradient.addColorStop(0, `rgba(58, 30, 15, ${groundVisibility})`);
        groundGradient.addColorStop(1, `rgba(40, 20, 10, ${groundVisibility})`);

        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.2);

        // Draw campfire logs and people
        if (newZoomProgress > 0.7) {
          const logVisibility = (newZoomProgress - 0.7) * 3.33; // 0 to 1

          ctx.save();
          ctx.globalAlpha = logVisibility;

          // Draw logs in a teepee formation
          ctx.fillStyle = "#5d3a1a"; // Brown color for logs

          // Log 1 (left)
          ctx.save();
          ctx.translate(campfireX, campfireY);
          ctx.rotate(-Math.PI / 4);
          ctx.fillRect(-logWidth / 2, -logHeight / 2, logWidth, logHeight);
          ctx.restore();

          // Log 2 (right)
          ctx.save();
          ctx.translate(campfireX, campfireY);
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-logWidth / 2, -logHeight / 2, logWidth, logHeight);
          ctx.restore();

          // Log 3 (back)
          ctx.save();
          ctx.translate(campfireX, campfireY - 5);
          ctx.rotate(Math.PI / 2);
          ctx.fillRect(-logWidth / 2, -logHeight / 2, logWidth, logHeight);
          ctx.restore();

          // Draw people sitting around the campfire
          people.forEach((person) => {
            // Add subtle bobbing motion
            const bob = Math.sin(time * person.bobSpeed + person.bobOffset) * 3;

            // Draw person (simplified figure)
            // Head
            ctx.fillStyle = person.color;
            ctx.beginPath();
            ctx.arc(
              person.x,
              person.y - person.size / 2 + bob,
              person.size / 3,
              0,
              Math.PI * 2,
            );
            ctx.fill();

            // Body (sitting)
            ctx.beginPath();
            ctx.ellipse(
              person.x,
              person.y + person.size / 4 + bob,
              person.size / 2.5,
              person.size / 1.5,
              0,
              0,
              Math.PI * 2,
            );
            ctx.fill();

            // Draw shadow beneath person
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.beginPath();
            ctx.ellipse(
              person.x,
              person.y + person.size / 1.2,
              person.size / 1.8,
              person.size / 4,
              0,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          });

          ctx.restore();

          // Create and update flame particles
          if (Math.random() < 0.3) {
            createFlameParticle();
          }

          // Draw and update flame particles
          for (let i = flameParticles.length - 1; i >= 0; i--) {
            const particle = flameParticles[i];
            particle.y -= particle.speed;
            particle.life++;

            if (particle.life > particle.maxLife) {
              flameParticles.splice(i, 1);
              continue;
            }

            const lifeRatio = 1 - particle.life / particle.maxLife;
            ctx.globalAlpha = lifeRatio * logVisibility;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(
              particle.x,
              particle.y,
              particle.size * lifeRatio,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }

          // Draw glow around campfire
          const glowRadius = 100;
          const gradient = ctx.createRadialGradient(
            campfireX,
            campfireY,
            0,
            campfireX,
            campfireY,
            glowRadius,
          );
          gradient.addColorStop(
            0,
            `rgba(255, 100, 20, ${0.4 * logVisibility})`,
          );
          gradient.addColorStop(1, "rgba(255, 100, 20, 0)");

          ctx.globalAlpha = 1;
          ctx.fillStyle = gradient;
          ctx.fillRect(
            campfireX - glowRadius,
            campfireY - glowRadius,
            glowRadius * 2,
            glowRadius * 2,
          );
        }
      }

      // Add a subtle red pulsing overlay
      ctx.save();
      ctx.globalAlpha = 0.05 + 0.05 * Math.sin(time * 0.001);
      ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", createStars);
      window.removeEventListener("resize", createPeople);
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
