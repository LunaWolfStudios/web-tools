import React, { useEffect, useRef } from "react";

interface BackgroundFXProps {
  isRunning: boolean;
  mode: "normal" | "green" | "red";
  rippleTrigger?: number;
  rippleColor?: string;
}

class Ripple {
    x: number;
    y: number;
    radius: number;
    alpha: number;
    lineWidth: number;
    color: string;

    constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.alpha = 1;
        this.lineWidth = 5;
        this.color = color;
    }

    update() {
        this.radius += 5;
        this.alpha -= 0.01;
        this.lineWidth -= 0.05;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color.replace(')', `, ${this.alpha})`).replace('rgb', 'rgba').replace('rgbaa', 'rgba');
        // Simple hack to inject alpha if color is hex or rgb. 
        // Actually, let's just assume the passed color is a hex or valid CSS string and use globalAlpha or just string manipulation if needed.
        // Easier:
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = Math.max(0.1, this.lineWidth);
        ctx.stroke();
        ctx.restore();
    }
}

export const BackgroundFX: React.FC<BackgroundFXProps> = ({ isRunning, mode, rippleTrigger, rippleColor = "#ffffff" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);

  // Add ripple when trigger changes
  useEffect(() => {
    if (rippleTrigger && rippleTrigger > 0) {
        ripplesRef.current.push(new Ripple(window.innerWidth / 2, window.innerHeight / 2, rippleColor));
    }
  }, [rippleTrigger, rippleColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 3;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
        
        if (mode === "green") {
            this.color = `rgba(0, 255, 157, ${this.alpha})`;
        } else if (mode === "red") {
            this.color = `rgba(255, 42, 109, ${this.alpha})`;
        } else {
            this.color = `rgba(0, 243, 255, ${this.alpha})`;
        }
      }

      update() {
        this.x += this.speedX * (isRunning ? 2 : 0.5);
        this.y += this.speedY * (isRunning ? 2 : 0.5);

        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw subtle gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );
      
      if (mode === "green") {
        gradient.addColorStop(0, "rgba(5, 20, 15, 1)");
        gradient.addColorStop(1, "rgba(0, 10, 5, 1)");
      } else if (mode === "red") {
        gradient.addColorStop(0, "rgba(20, 5, 10, 1)");
        gradient.addColorStop(1, "rgba(10, 0, 5, 1)");
      } else {
        gradient.addColorStop(0, "rgba(5, 10, 20, 1)");
        gradient.addColorStop(1, "rgba(2, 5, 10, 1)");
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Update and draw ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
          const ripple = ripplesRef.current[i];
          ripple.update();
          ripple.draw(ctx);
          if (ripple.alpha <= 0) {
              ripplesRef.current.splice(i, 1);
          }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, mode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] w-full h-full pointer-events-none"
    />
  );
};
