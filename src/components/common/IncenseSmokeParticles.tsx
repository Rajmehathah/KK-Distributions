import React, { useEffect, useRef } from 'react';

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  fadeSpeed: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayOffset: number;
  life: number;
  maxLife: number;
  color: string;
}

interface IncenseSmokeParticlesProps {
  className?: string;
  particleColor?: string; // e.g. 'rgba(245, 230, 211, ' for cream-white
  opacity?: number;
}

export const IncenseSmokeParticles: React.FC<IncenseSmokeParticlesProps> = ({
  className = '',
  particleColor = 'rgba(245, 235, 220, ', // Cream-white base
  opacity = 0.45
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: SmokeParticle[] = [];
    const maxParticles = 60;

    // Handle resizing & high-DPI scaling
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create a new particle
    const createParticle = (spawnX: number, isInitial = false): SmokeParticle => {
      const maxLife = 400 + Math.random() * 300;
      const yStart = canvas.height / (window.devicePixelRatio || 1) + 20;
      
      return {
        x: spawnX + (Math.random() * 40 - 20),
        y: isInitial ? Math.random() * yStart : yStart,
        vx: Math.random() * 0.4 - 0.2,
        vy: -(0.5 + Math.random() * 0.8), // rising up
        size: 15 + Math.random() * 25, // wispy large puff
        alpha: 0,
        targetAlpha: 0.15 + Math.random() * 0.25,
        fadeSpeed: 0.005 + Math.random() * 0.005,
        swaySpeed: 0.003 + Math.random() * 0.005,
        swayAmplitude: 15 + Math.random() * 35,
        swayOffset: Math.random() * Math.PI * 2,
        life: isInitial ? Math.random() * maxLife : 0,
        maxLife,
        color: Math.random() > 0.85 ? 'rgba(212, 175, 55, ' : particleColor // 15% gold particles
      };
    };

    // Initialize particles across different spawn points (left, center-left, center, center-right, right)
    const spawnPoints = [0.25, 0.4, 0.5, 0.6, 0.75];
    const width = canvas.width / (window.devicePixelRatio || 1);
    
    for (let i = 0; i < maxParticles * 0.6; i++) {
      const spawnX = width * spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
      particles.push(createParticle(spawnX, true));
    }

    const animate = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, w, h);

      // Smooth glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.1)';

      // Periodically spawn new particles if under limit
      if (particles.length < maxParticles && Math.random() < 0.15) {
        const spawnX = w * spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
        particles.push(createParticle(spawnX));
      }

      particles = particles.filter(p => {
        p.life += 1;
        p.y += p.vy;
        
        // Horizontal sway using sine waves for natural breeze effect
        p.x += p.vx + Math.sin(p.life * p.swaySpeed + p.swayOffset) * (p.swayAmplitude / 250);
        
        // Grow larger as it rises and diffuses
        p.size += 0.08;

        // Fade in initially, then fade out near end of life or top of canvas
        const lifeRatio = p.life / p.maxLife;
        const nearTopRatio = p.y / h; // 1 at bottom, 0 at top

        if (lifeRatio < 0.2) {
          // Fade in
          p.alpha += (p.targetAlpha - p.alpha) * 0.05;
        } else if (lifeRatio > 0.7) {
          // Fade out due to old age
          p.alpha -= p.alpha * 0.02;
        } else if (nearTopRatio < 0.25) {
          // Fade out near the top of the canvas
          p.alpha -= p.alpha * 0.04;
        }

        // Clip alpha
        if (p.alpha < 0.001) return false;
        if (p.life >= p.maxLife) return false;
        if (p.y < -p.size) return false;

        // Draw particle as a soft wispy gradient radial puff
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        const finalAlpha = Math.max(0, p.alpha * opacity);
        
        grad.addColorStop(0, `${p.color}${finalAlpha})`);
        grad.addColorStop(0.3, `${p.color}${finalAlpha * 0.5})`);
        grad.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Draw subtle decorative continuous vector smoke lines for premium contrast
      drawSmokeLine(ctx, w, h);

      animationFrameId = requestAnimationFrame(animate);
    };

    // Draw thin organic flowing smoke trails
    let lineTime = 0;
    const drawSmokeLine = (c: CanvasRenderingContext2D, w: number, h: number) => {
      lineTime += 0.002;
      c.save();
      
      const lineCount = 3;
      for (let j = 0; j < lineCount; j++) {
        c.beginPath();
        c.strokeStyle = j === 1 ? 'rgba(212, 175, 55, 0.08)' : 'rgba(245, 235, 220, 0.08)';
        c.lineWidth = 1.5 + j * 0.5;
        
        const startX = w * (0.4 + j * 0.1);
        c.moveTo(startX, h + 10);

        for (let y = h; y > h * 0.15; y -= 10) {
          const progress = (h - y) / h;
          const sway = Math.sin(y * 0.008 - lineTime * 2 + j) * (20 + progress * 50);
          const drift = progress * 40 * (j - 1);
          c.lineTo(startX + sway + drift, y);
        }
        
        c.stroke();
      }
      c.restore();
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleColor, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none mix-blend-screen select-none z-[1] ${className}`}
    />
  );
};

export default IncenseSmokeParticles;
